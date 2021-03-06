import * as React from "react";
import { IconMenu, IconButton, MenuItem } from "material-ui";
import Keywords from "./keywords";
import InfoList from "./infoList";
import Comments from "./comments";
import CommentInput from "./commentInput";
import PublishInfoList from "./publishInfoList";
import Abstract from "./abstract";
import Title from "./title";
import Icon from "../../../../icons";
import checkAuthDialog from "../../../../helpers/checkAuthDialog";
import { IPaperRecord } from "../../../../model/paper";
import { IPaperSourceRecord } from "../../../../model/paperSource";
import { ICurrentUserRecord } from "../../../../model/currentUser";

const styles = require("./searchItem.scss");

export interface ISearchItemProps {
  paper: IPaperRecord;
  commentInput: string;
  changeCommentInput: (comment: string) => void;
  isAbstractOpen: boolean;
  toggleAbstract: () => void;
  isCommentsOpen: boolean;
  toggleComments: () => void;
  isAuthorsOpen: boolean;
  toggleAuthors: () => void;
  isTitleVisited: boolean;
  visitTitle: () => void;
  handlePostComment: () => void;
  isLoading: boolean;
  searchQueryText: string;
  isFirstOpen: boolean;
  closeFirstOpen: () => void;
  currentUser: ICurrentUserRecord;
  deleteComment: (commentId: number) => void;
  getMoreComments: () => void;
  isPageLoading: boolean;
}

const mockCitedPaperAvgIF = 2.22;
const mockPlutoScore = 234;

interface HandleClickClaim {
  paperId: number;
  cognitiveId?: number;
}

function handleClickClaim({ paperId, cognitiveId }: HandleClickClaim) {
  const targetId = cognitiveId ? `c_${cognitiveId}` : paperId;

  window.open(
    `https://docs.google.com/forms/d/e/1FAIpQLScS76iC1pNdq94mMlxSGjcp_BuBM4WqlTpfPDt19LgVJ-t7Ng/viewform?usp=pp_url&entry.130188959=${targetId}&entry.1298741478`,
    "_blank",
  );
}

const SearchItem = (props: ISearchItemProps) => {
  const {
    isCommentsOpen,
    toggleComments,
    isAuthorsOpen,
    toggleAuthors,
    commentInput,
    isAbstractOpen,
    toggleAbstract,
    changeCommentInput,
    handlePostComment,
    isLoading,
    searchQueryText,
    isFirstOpen,
    closeFirstOpen,
    currentUser,
    deleteComment,
    isTitleVisited,
    visitTitle,
    getMoreComments,
    isPageLoading,
    paper,
  } = props;
  const {
    title,
    venue,
    authors,
    year,
    fosList,
    citedCount,
    referenceCount,
    doi,
    id,
    abstract,
    comments,
    urls,
    commentCount,
    journal,
    cognitivePaperId,
  } = paper;

  const pdfSourceRecord = urls.find((paperSource: IPaperSourceRecord) => {
    if (paperSource.url.includes(".pdf")) return true;
  });
  let pdfSourceUrl;

  if (!!pdfSourceRecord) {
    pdfSourceUrl = pdfSourceRecord.url;
  }

  let source;
  if (!!doi) {
    source = `https://dx.doi.org/${doi}`;
  } else if (urls.size > 0) {
    source = urls.getIn([0, "url"]);
  }

  return (
    <div className={styles.searchItemWrapper}>
      <div className={styles.contentSection}>
        <div className={styles.titleWrapper}>
          <Title
            title={title}
            searchQueryText={searchQueryText}
            source={source}
            isTitleVisited={isTitleVisited}
            visitTitle={visitTitle}
          />

          <IconMenu
            iconButtonElement={
              <IconButton style={{ width: 40, height: "auto" }}>
                <Icon className={styles.ellipsisIcon} icon="ELLIPSIS" />
              </IconButton>
            }
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            targetOrigin={{ horizontal: "right", vertical: "bottom" }}
            className={styles.claimButton}
          >
            <MenuItem
              style={{
                color: "#f54b5e",
              }}
              primaryText="Claim"
              onClick={() => {
                handleClickClaim({ paperId: id, cognitiveId: cognitivePaperId });
              }}
            />
          </IconMenu>
        </div>
        <PublishInfoList
          journalName={!!journal ? journal.fullTitle : venue}
          journalIF={!!journal ? journal.impactFactor : null}
          year={year}
          authors={authors}
          isAuthorsOpen={isAuthorsOpen}
          toggleAuthors={toggleAuthors}
        />
        <Abstract
          abstract={abstract}
          isAbstractOpen={isAbstractOpen}
          toggleAbstract={toggleAbstract}
          searchQueryText={searchQueryText}
          isFirstOpen={isFirstOpen}
          closeFirstOpen={closeFirstOpen}
        />
        <Keywords keywords={fosList} />
        <InfoList
          referenceCount={referenceCount}
          citedCount={citedCount}
          citedPaperAvgIF={mockCitedPaperAvgIF}
          plutoScore={mockPlutoScore}
          DOI={doi}
          articleId={id}
          cognitiveId={cognitivePaperId}
          searchQueryText={searchQueryText}
          pdfSourceUrl={pdfSourceUrl}
        />
        <CommentInput
          isLoading={isLoading}
          isCommentsOpen={isCommentsOpen}
          checkAuthDialog={checkAuthDialog}
          commentInput={commentInput}
          changeCommentInput={changeCommentInput}
          toggleComments={toggleComments}
          handlePostComment={handlePostComment}
          commentCount={commentCount}
        />
        <Comments
          currentUser={currentUser}
          comments={comments}
          isCommentsOpen={isCommentsOpen}
          deleteComment={deleteComment}
          commentCount={commentCount}
          getMoreComments={getMoreComments}
          isPageLoading={isPageLoading}
        />
      </div>
    </div>
  );
};

export default SearchItem;
