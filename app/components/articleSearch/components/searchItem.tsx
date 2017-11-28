import * as React from "react";
import { IArticleRecord } from "../../../model/article";
import Tooltip from "../../common/tooltip/tooltip";
import Icon from "../../../icons";
import { trackAndOpenLink, trackAction } from "../../../helpers/handleGA";
import { Link } from "react-router-dom";
import alertToast from "../../../helpers/makePlutoToastAction";

// const shave = require("shave").default;
const styles = require("./searchItem.scss");

export interface ISearchItemProps {
  article: IArticleRecord;
}

class SearchItem extends React.PureComponent<ISearchItemProps, {}> {
  private getAuthors = () => {
    const mockAuthor = {
      name: "Darling Shan",
      institution: "University of Washington",
      hIndex: 121,
    };
    const mockAuthors = [mockAuthor, mockAuthor, mockAuthor];
    const authorItems = mockAuthors.map((author, index) => {
      return (
        <div className={styles.author} key={`author_${index}`}>
          {author.name}
          <div className={styles.authorHIndex}>
            <Tooltip
              className={styles.authorHIndexTooltip}
              left={-37}
              top={-26}
              iconTop={-9}
              content={`h - index : ${author.hIndex}`}
              type="h-index"
            />
            {author.hIndex}
          </div>
          {`(${author.institution})`}
          {index !== mockAuthors.length - 1 ? "," : null}
        </div>
      );
    });

    return <div className={styles.authors}>{authorItems}</div>;
  };

  private getKeywordList = () => {
    const mockKeywordList = ["Apoptosis", "test", "test2", "test3", "test4"];
    const keywordItems = mockKeywordList.map((keyword, index) => {
      let keywordContent = keyword;
      if (index !== mockKeywordList.length - 1) {
        keywordContent = `${keyword} · `;
      }
      return (
        <Link
          to={`/search?query=${keyword}&page=1&keyword=${keyword}`}
          onClick={() => trackAction(`/search?query=${keyword}&page=1&keyword=${keyword}`, "SearchItemKeyword")}
          className={styles.keyword}
          key={`keyword_${index}`}
        >
          {keywordContent}
        </Link>
      );
    });

    return <div className={styles.keywordList}>{keywordItems}</div>;
  };

  private copyDOI = () => {
    const mockDOI = "testDOI";
    const textField = document.createElement("textarea");
    textField.innerText = mockDOI;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();

    alertToast({
      type: "success",
      message: "Copied!",
    });
  };

  public render() {
    const { article } = this.props;

    console.log("article is ", article);

    return (
      <div className={styles.searchItemWrapper}>
        <div className={styles.contentSection}>
          <div className={styles.title}>
            Apoptosis of malignant human B cells by ligation of CD20 with monoclonal antibodies.
          </div>
          <div className={styles.publishInfoList}>
            <a
              onClick={() => {
                trackAndOpenLink("https://medium.com/pluto-network", "searchItemJournal");
              }}
              className={styles.underline}
            >
              Blood
            </a>
            <span className={styles.bold}>[IF: 5.84]</span>
            <div className={styles.separatorLine} />
            <span className={styles.bold}>1988</span>
            <div className={styles.separatorLine} />
            {this.getAuthors()}
          </div>
          <div
            className={styles.content}
          >{`A cluster of risk factors for cardiovascular disease and type 2 diabetes mellitus, which occur together more often than by chance alone, have become known as the metabolic syndrome. The risk factors include raised blood pressure, dyslipidemia (raised triglycerides and lowered high-density lipoprotein cholesterol), raised fasting glucose, and central obesity. Various diagnostic criteria have been proposed by different organizations over the past decade. Most recently, these have come from the International Diabetes Federation and the American Heart Association/National Heart, Lung, and Blood Institute. The main difference concerns the measure for central obesity, with this being an obligatory component in the International Diabetes Federation definition, lower than in the American Heart Association/National Heart, Lung, and Blood Institute criteria, and ethnic specific. The present article represents the outcome of a meeting between several major organizations in an attempt to unify criteria. It was agreed that there should not be an obligatory component, but that waist measurement would continue to be a useful preliminary screening tool. Three abnormal findings out of 5 would qualify a person for the metabolic syndrome. A single set of cut points would be used for all components except waist circumference, for which further work is required. In the interim, national or regional cut points for waist circumference can be used.`}</div>
          {this.getKeywordList()}
          <div className={styles.infoList}>
            <div className={styles.referenceButton}>Ref 21</div>
            <div className={styles.citedButton}>Cited 682</div>
            <span className={styles.explanation}>Cited Paper Avg IF</span>
            <span className={styles.citedPaperAvgIF}>2.22</span>
            <div className={styles.separatorLine} />
            <span className={styles.explanation}>Pltuo Score</span>
            <span className={styles.pltuoScore}>32.232</span>
            <div className={styles.rightBox}>
              <div
                onClick={() => {
                  trackAndOpenLink("https://medium.com/pluto-network", "searchItemSource");
                }}
                className={styles.sourceButton}
              >
                <Icon className={styles.articleSourceIconWrapper} icon="ARTICLE_SOURCE" />
                Source
              </div>
              <div onClick={this.copyDOI} className={styles.copyDOIButton}>
                Copy DOI
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchItem;