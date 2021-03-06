import * as React from "react";
import { IArticleSearchStateRecord } from "../../records";
const styles = require("./noResult.scss");

export enum NoResultType {
  "FROM_SEARCH_QUERY",
  "FROM_REF",
  "FROM_CITE",
}

interface NoResultProps {
  type: NoResultType;
  searchText?: string;
  articleSearchState: IArticleSearchStateRecord;
}

function getNoResultFromContent(props: NoResultProps) {
  switch (props.type) {
    case NoResultType.FROM_SEARCH_QUERY: {
      return `[${props.searchText}]`;
    }

    case NoResultType.FROM_REF: {
      if (props.articleSearchState.targetPaper) {
        return `References of article [${props.articleSearchState.targetPaper.title}]`;
      } else {
        return "References of article";
      }
    }

    case NoResultType.FROM_CITE: {
      if (props.articleSearchState.targetPaper) {
        return `Cited of article [${props.articleSearchState.targetPaper.title}]`;
      } else {
        return "Cited of article";
      }
    }
  }
}

const NoResult = (props: NoResultProps) => {
  return (
    <div className={styles.articleSearchContainer}>
      <div className={styles.noPapersContainer}>
        <div className={styles.noPapersTitle}>No Papers Found :(</div>
        <div className={styles.noPapersContent}>
          Sorry, there are no results for <span className={styles.keyword}>{getNoResultFromContent(props)}.</span>
        </div>
      </div>
    </div>
  );
};

export default NoResult;
