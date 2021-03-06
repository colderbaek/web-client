import { Dispatch } from "redux";
import { push } from "react-router-redux";
import AuthAPI from "../../../api/auth";
import { IPostExchangeResult, OAUTH_VENDOR, IGetAuthorizeUriResult } from "../../../api/types/auth";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import validateEmail from "../../../helpers/validateEmail";
import { SIGN_UP_ON_FOCUS_TYPE, SIGN_UP_STEP, ISignUpStateRecord, ISignUpOauthInfo } from "./records";
import { closeDialog } from "../../dialog/actions";
import alertToast from "../../../helpers/makePlutoToastAction";
import EnvChecker from "../../../helpers/envChecker";
import { recordify } from "typed-immutable-record";
import { IMemberRecord } from "../../../model/member";
import { trackEvent, trackModalView } from "../../../helpers/handleGA";

export function changeEmailInput(email: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_EMAIL_INPUT,
    payload: {
      email,
    },
  };
}

export function checkValidEmailInput(email: string) {
  const isInValidEmail: boolean = !validateEmail(email);

  if (isInValidEmail) {
    return makeFormErrorMessage("email", "Please enter a valid email address");
  } else {
    return removeFormErrorMessage("email");
  }
}

export function checkDuplicatedEmail(email: string) {
  return async (dispatch: Dispatch<any>) => {
    try {
      const checkDuplicatedEmailResult = await AuthAPI.checkDuplicatedEmail(email);

      dispatch({
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL,
      });
      if (checkDuplicatedEmailResult.duplicated) {
        dispatch(makeFormErrorMessage("email", "Email address already exists"));
      }
    } catch (err) {
      alert(`Failed to check duplicated email! ${err}`);
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FAILED_TO_CHECK_DUPLICATED_EMAIL,
      });
      dispatch(removeFormErrorMessage("password"));
    }
  };
}

export function changePasswordInput(password: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_PASSWORD_INPUT,
    payload: {
      password,
    },
  };
}

export function checkValidPasswordInput(password: string) {
  const isPasswordEmpty = password === "" || password.length <= 0;
  const isPasswordShort = password.length < 8;

  if (isPasswordEmpty) {
    return makeFormErrorMessage("password", "Please enter password");
  } else if (isPasswordShort) {
    return makeFormErrorMessage("password", "Must have at least 8 characters!");
  } else {
    return removeFormErrorMessage("password");
  }
}

export function changeNameInput(name: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_NAME_INPUT,
    payload: {
      name,
    },
  };
}

export function checkValidNameInput(name: string) {
  const isNameTooShort = name === "" || name.length <= 0;

  if (isNameTooShort) {
    return makeFormErrorMessage("name", "Please enter name");
  } else {
    return removeFormErrorMessage("name");
  }
}

export function changeAffiliationInput(affiliation: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_AFFILIATION_INPUT,
    payload: {
      affiliation,
    },
  };
}

export function checkValidAffiliationInput(affiliation: string) {
  const isAffiliationTooShort = affiliation === "" || affiliation.length <= 0;

  if (isAffiliationTooShort) {
    return makeFormErrorMessage("affiliation", "Please enter affiliation");
  } else {
    return removeFormErrorMessage("affiliation");
  }
}

export function makeFormErrorMessage(type: string, errorMessage: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_FORM_ERROR,
    payload: {
      type,
      errorMessage,
    },
  };
}

export function removeFormErrorMessage(type: string) {
  return {
    type: ACTION_TYPES.SIGN_UP_REMOVE_FORM_ERROR,
    payload: {
      type,
    },
  };
}

export function onFocusInput(type: SIGN_UP_ON_FOCUS_TYPE) {
  return {
    type: ACTION_TYPES.SIGN_UP_ON_FOCUS_INPUT,
    payload: {
      type,
    },
  };
}

export function onBlurInput() {
  return {
    type: ACTION_TYPES.SIGN_UP_ON_BLUR_INPUT,
  };
}

export function changeSignUpStep(step: SIGN_UP_STEP) {
  return {
    type: ACTION_TYPES.SIGN_UP_CHANGE_SIGN_UP_STEP,
    payload: {
      step,
    },
  };
}

export function signUpWithEmail(currentStep: SIGN_UP_STEP, signUpState: ISignUpStateRecord, isDialog: boolean) {
  return async (dispatch: Dispatch<any>) => {
    const { email, password, affiliation, name } = signUpState;

    switch (currentStep) {
      case SIGN_UP_STEP.FIRST: {
        const isInValidEmail: boolean = !validateEmail(email);
        if (isInValidEmail) {
          dispatch(makeFormErrorMessage("email", "Please enter a valid email address"));
        } else {
          dispatch(removeFormErrorMessage("email"));
        }

        let isDuplicatedEmail: boolean = false;
        if (!isInValidEmail) {
          try {
            const checkDuplicatedEmailResult = await AuthAPI.checkDuplicatedEmail(email);

            dispatch({
              type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL,
            });

            if (checkDuplicatedEmailResult.duplicated) {
              dispatch(makeFormErrorMessage("email", "Email address already exists"));
              isDuplicatedEmail = true;
            } else {
              dispatch(removeFormErrorMessage("password"));
            }
          } catch (err) {
            alert(`Failed to sign up with email! ${err}`);
            dispatch({
              type: ACTION_TYPES.SIGN_UP_FAILED_TO_CHECK_DUPLICATED_EMAIL,
            });
          }
        }

        const isPasswordTooShort = password === "" || password.length <= 0 || password.length < 8;

        if (password === "" || password.length <= 0) {
          dispatch(makeFormErrorMessage("password", "Please enter password"));
        } else if (password.length < 8) {
          dispatch(makeFormErrorMessage("password", "Must have at least 8 characters!"));
        } else {
          dispatch(removeFormErrorMessage("password"));
        }

        trackEvent({ category: "sign_up", action: "try_to_sign_up_step_1", label: "with_email" });

        if (isInValidEmail || isDuplicatedEmail || isPasswordTooShort) {
          trackEvent({ category: "sign_up", action: "failed_to_sign_up_step_1", label: "with_email" });
          return;
        }

        dispatch(changeSignUpStep(SIGN_UP_STEP.WITH_EMAIL));
        break;
      }

      case SIGN_UP_STEP.WITH_EMAIL: {
        const isInValidEmail: boolean = !validateEmail(email);

        if (isInValidEmail) {
          dispatch(makeFormErrorMessage("email", "Please enter a valid email address"));
        } else {
          dispatch(removeFormErrorMessage("email"));
        }

        let isDuplicatedEmail: boolean = false;

        if (!isInValidEmail) {
          try {
            const checkDuplicatedEmailResult = await AuthAPI.checkDuplicatedEmail(email);

            dispatch({
              type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL,
            });

            if (checkDuplicatedEmailResult.duplicated) {
              dispatch(makeFormErrorMessage("email", "Email address already exists"));
              isDuplicatedEmail = true;
            } else {
              dispatch(removeFormErrorMessage("password"));
            }
          } catch (err) {
            alert(`Failed to sign up with email! ${err}`);
            dispatch({
              type: ACTION_TYPES.SIGN_UP_FAILED_TO_CHECK_DUPLICATED_EMAIL,
            });
          }
        }

        const isPasswordEmpty = password === "" || password.length <= 0;
        const isPasswordShort = password.length < 8;
        const isPasswordNotValid = isPasswordEmpty || isPasswordShort;

        if (isPasswordEmpty) {
          dispatch(makeFormErrorMessage("password", "Please enter password"));
        } else if (isPasswordShort) {
          dispatch(makeFormErrorMessage("password", "Must have at least 8 characters!"));
        } else {
          dispatch(removeFormErrorMessage("password"));
        }

        const isNameTooShort = name === "" || name.length <= 0;

        if (isNameTooShort) {
          dispatch(makeFormErrorMessage("name", "Please enter name"));
        } else {
          dispatch(removeFormErrorMessage("name"));
        }

        const isAffiliationTooShort = affiliation === "" || affiliation.length <= 0;

        if (isAffiliationTooShort) {
          dispatch(makeFormErrorMessage("affiliation", "Please enter affiliation"));
        } else {
          dispatch(removeFormErrorMessage("affiliation"));
        }

        if (isInValidEmail || isDuplicatedEmail || isPasswordNotValid || isAffiliationTooShort || isNameTooShort)
          return;

        dispatch({
          type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT,
        });

        trackEvent({ category: "sign_up", action: "try_to_sign_up", label: "with_email" });

        try {
          const signUpResult: IMemberRecord = await AuthAPI.signUpWithEmail({
            email,
            password,
            name,
            affiliation,
          });

          dispatch({
            type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT,
          });

          // Auto Sign in after Sign up at API Server. So we don't need to call sign in api again.
          dispatch({
            type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
            payload: {
              user: signUpResult,
              loggedIn: true,
              oauthLoggedIn: false, // Because this method is signUpWithEmail
            },
          });

          dispatch(changeSignUpStep(SIGN_UP_STEP.FINAL_WITH_EMAIL));
          alertToast({
            type: "success",
            message: "Succeeded to Sign Up!!",
          });
          trackEvent({ category: "sign_up", action: "succeed_to_sign_up", label: "with_email" });
        } catch (err) {
          trackEvent({ category: "sign_up", action: "failed_to_sign_up", label: "with_email" });
          alert(`Failed to sign up with email! ${err}`);
          dispatch({
            type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT,
          });
        }
        break;
      }
      case SIGN_UP_STEP.FINAL_WITH_EMAIL: {
        if (isDialog) {
          dispatch(closeDialog());
          trackModalView("signUpWithEmailClose");
        } else {
          dispatch(push("/"));
        }
        break;
      }

      default:
        break;
    }
  };
}

export function signUpWithSocial(
  currentStep: SIGN_UP_STEP,
  vendor: OAUTH_VENDOR,
  oauthRedirectPath: string,
  signUpState?: ISignUpStateRecord,
) {
  return async (dispatch: Dispatch<any>) => {
    switch (currentStep) {
      case SIGN_UP_STEP.FIRST: {
        if (!vendor) return;
        try {
          const origin = EnvChecker.getOrigin();
          const redirectUri = `${origin}/users/sign_up?vendor=${vendor}`;
          const authorizeUriData: IGetAuthorizeUriResult = await AuthAPI.getAuthorizeUri({
            vendor,
            redirectUri,
          });

          trackEvent({ category: "sign_up", action: "try_to_sign_up_step_1", label: `with_${vendor}` });

          window.location.replace(authorizeUriData.uri);
        } catch (err) {
          alert(`Failed to sign up with social! ${err}`);

          trackEvent({ category: "sign_up", action: "failed_to_sign_up_step_1", label: `with_${vendor}` });

          dispatch({
            type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT,
          });
        }
        break;
      }

      case SIGN_UP_STEP.WITH_SOCIAL: {
        const { email, affiliation, name, oauth } = signUpState;

        const isInValidEmail: boolean = !validateEmail(email);

        if (isInValidEmail) {
          dispatch(makeFormErrorMessage("email", "Please enter a valid email address"));
        } else {
          dispatch(removeFormErrorMessage("email"));
        }

        let isDuplicatedEmail: boolean = false;

        if (!isInValidEmail) {
          try {
            const checkDuplicatedEmailResult = await AuthAPI.checkDuplicatedEmail(email);

            dispatch({
              type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CHECK_DUPLICATED_EMAIL,
            });

            if (checkDuplicatedEmailResult.duplicated) {
              dispatch(makeFormErrorMessage("email", "Email address already exists"));
              isDuplicatedEmail = true;
            } else {
              dispatch(removeFormErrorMessage("email"));
            }
          } catch (err) {
            alert(`Failed to sign up with social! ${err}`);
            dispatch({
              type: ACTION_TYPES.SIGN_UP_FAILED_TO_CHECK_DUPLICATED_EMAIL,
            });
          }
        }

        const isNameTooShort = name === "" || name.length <= 0;

        if (isNameTooShort) {
          dispatch(makeFormErrorMessage("name", "Please enter name"));
        } else {
          dispatch(removeFormErrorMessage("name"));
        }

        const isAffiliationTooShort = affiliation === "" || affiliation.length <= 0;

        if (isAffiliationTooShort) {
          dispatch(makeFormErrorMessage("affiliation", "Please enter affiliation"));
        } else {
          dispatch(removeFormErrorMessage("affiliation"));
        }

        if (isInValidEmail || isDuplicatedEmail || isNameTooShort || isAffiliationTooShort) return;

        dispatch({
          type: ACTION_TYPES.SIGN_UP_START_TO_CREATE_ACCOUNT,
        });

        trackEvent({ category: "sign_up", action: "try_to_sign_up", label: `with_${vendor}` });

        try {
          const signUpResult: IMemberRecord = await AuthAPI.signUpWithSocial({
            email,
            name,
            affiliation,
            oauth: {
              oauthId: oauth.oauthId,
              uuid: oauth.uuid,
              vendor: oauth.vendor,
            },
          });

          dispatch({
            type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_CREATE_ACCOUNT,
          });

          trackEvent({ category: "sign_up", action: "succeed_to_sign_up", label: `with_${vendor}` });

          const hasToRedirectToHome =
            !oauthRedirectPath ||
            oauthRedirectPath.includes("users/sign_in") ||
            oauthRedirectPath.includes("users/sign_up");
          if (hasToRedirectToHome) {
            dispatch(push("/"));
            alertToast({
              type: "success",
              message: "Succeeded to Sign Up!!",
            });
          } else {
            dispatch(push(oauthRedirectPath));
            alertToast({
              type: "success",
              message: "Succeeded to Sign Up!!",
            });
          }

          // Auto Sign in after Sign up at API Server. So we don't need to call sign in api again.
          dispatch({
            type: ACTION_TYPES.SIGN_IN_SUCCEEDED_TO_SIGN_IN,
            payload: {
              user: signUpResult,
              loggedIn: true,
              oauthLoggedIn: true, // Because this method is signUpWithSocial
            },
          });
        } catch (err) {
          alert(`Failed to sign up! ${err}`);
          trackEvent({ category: "sign_up", action: "failed_to_sign_up", label: `with_${vendor}` });
          dispatch({
            type: ACTION_TYPES.SIGN_UP_FAILED_TO_CREATE_ACCOUNT,
          });
        }
        break;
      }

      default:
        break;
    }
  };
}

export function getAuthorizeCode(code: string, vendor: OAUTH_VENDOR) {
  return async (dispatch: Dispatch<any>) => {
    dispatch({
      type: ACTION_TYPES.SIGN_UP_GET_AUTHORIZE_CODE,
    });

    dispatch({
      type: ACTION_TYPES.SIGN_UP_START_TO_EXCHANGE,
    });

    try {
      const origin = EnvChecker.getOrigin();
      const redirectUri = `${origin}/users/sign_up?vendor=${vendor}`;

      const postExchangeData: IPostExchangeResult = await AuthAPI.postExchange({
        code,
        vendor,
        redirectUri,
      });

      if (postExchangeData.connected) {
        alert(`You already sign up with this social account`);
        dispatch({
          type: ACTION_TYPES.SIGN_UP_FAILED_TO_EXCHANGE,
        });
        dispatch(push("/users/sign_in"));

        return;
      }

      const recordifiedOauth: ISignUpOauthInfo = recordify({
        code,
        oauthId: postExchangeData.oauthId,
        uuid: postExchangeData.uuid,
        vendor,
      });

      dispatch({
        type: ACTION_TYPES.SIGN_UP_SUCCEEDED_TO_EXCHANGE,
        payload: {
          vendor,
          email: postExchangeData.userData.email || "",
          name: postExchangeData.userData.name || "",
          oauth: recordifiedOauth,
        },
      });
    } catch (err) {
      alert(`Failed to social sign up! ${err}`);
      dispatch({
        type: ACTION_TYPES.SIGN_UP_FAILED_TO_EXCHANGE,
      });
      dispatch(goBack());
    }
  };
}

export function goBack() {
  return {
    type: ACTION_TYPES.SIGN_UP_GO_BACK,
  };
}
