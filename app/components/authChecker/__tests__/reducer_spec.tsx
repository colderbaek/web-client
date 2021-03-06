jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import { IAuthCheckerStateRecord, AUTH_CHECKER_INITIAL_STATE } from "../records";

function reduceState(action: any, state: IAuthCheckerStateRecord = AUTH_CHECKER_INITIAL_STATE) {
  return reducer(state, action);
}

describe("AuthChecker reducer", () => {
  let mockAction: any;
  let state: IAuthCheckerStateRecord;

  describe("when receive AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN", () => {
    it("should set isLoading Falsy", () => {
      mockAction = {
        type: ACTION_TYPES.AUTH_SUCCEEDED_TO_CHECK_LOGGED_IN,
      };

      state = reduceState(mockAction);

      expect(state.isLoading).toBeFalsy();
    });
  });

  describe("when receive AUTH_FAILED_TO_CHECK_LOGGED_IN", () => {
    it("should set isLoading Falsy", () => {
      mockAction = {
        type: ACTION_TYPES.AUTH_FAILED_TO_CHECK_LOGGED_IN,
      };

      state = reduceState(mockAction);

      expect(state.isLoading).toBeFalsy();
    });
  });

  describe("when receive except action", () => {
    it("should set state to state", () => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_CLOSE_FIRST_OPEN,
      };

      state = reduceState(mockAction);

      expect(state).toEqual(state);
    });
  });
});
