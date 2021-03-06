import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import * as Actions from "../articleSearch/actions";
import { InputBox } from "../common/inputBox/inputBox";
import { trackAndOpenLink } from "../../helpers/handleGA";
import { IAppState } from "../../reducers";
import { IArticleSearchStateRecord } from "../articleSearch/records";
import Icon from "../../icons";
const styles = require("./home.scss");

export interface IHomeProps extends DispatchProp<IHomeMappedState> {
  articleSearchState: IArticleSearchStateRecord;
}

export interface IHomeMappedState {
  articleSearchState: IArticleSearchStateRecord;
}

function mapStateToProps(state: IAppState) {
  return {
    articleSearchState: state.articleSearch,
  };
}

class Home extends React.Component<IHomeProps, {}> {
  private changeSearchInput = (searchInput: string) => {
    const { dispatch } = this.props;

    dispatch(Actions.changeSearchInput(searchInput));
  };

  private handleSearchPush = () => {
    const { dispatch, articleSearchState } = this.props;

    dispatch(Actions.handleSearchPush(articleSearchState.searchInput));
  };

  public render() {
    const { searchInput } = this.props.articleSearchState;

    return (
      <div className={styles.articleSearchFormContainer}>
        <div className={styles.searchFormBackground} />
        <div className={styles.searchFormInnerContainer}>
          <div className={styles.searchFormContainer}>
            <div className={styles.searchTitle}>Do research, never re-search</div>
            <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                this.handleSearchPush();
              }}
            >
              <InputBox
                onChangeFunc={this.changeSearchInput}
                defaultValue={searchInput}
                placeHolder="Search papers"
                type="search"
                className={styles.inputBox}
                onClickFunc={this.handleSearchPush}
              />
            </form>
            <div className={styles.searchSubTitle}>
              {`PLUTO beta service is a free, nonprofit, academic discovery service of `}
              <a
                href="https://pluto.network"
                target="_blank"
                onClick={() => {
                  trackAndOpenLink("articleSearchPlutoNetwork");
                }}
                className={styles.plutoNetwork}
              >
                Pluto Network.
              </a>
            </div>
            <div className={styles.infoList}>
              <div className={styles.infoBox}>
                <Icon className={styles.iconWrapper} icon="INTUITIVE_FEED" />
                <div className={styles.infoContent}>
                  <div className={styles.title}>Intuitive Feed</div>
                  <div className={styles.content}>
                    Quickly skim through the search results with major indices on the authors and the article.
                  </div>
                </div>
              </div>
              <div className={styles.infoBox}>
                <Icon className={styles.iconWrapper} icon="POWERED_BY_COMMUNITY" />
                <div className={styles.infoContent}>
                  <div className={styles.title}>Powered by community</div>
                  <div className={styles.content}>
                    Comments on the paper make it easy to find meaningful papers that can be applied to my research
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Home);
