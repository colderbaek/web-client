import * as React from "react";
import { List } from "immutable";
import { ICommentRecord } from "../../../../model/comment";
import { ICurrentUserRecord } from "../../../../model/currentUser";
import Comment from "./comment";
import ButtonSpinner from "../../../common/spinner/buttonSpinner";
const styles = require("./comments.scss");

export const MINIMUM_SHOWING_COMMENT_NUMBER = 2;

export interface ICommentsProps {
  comments: List<ICommentRecord>;
  isCommentsOpen: boolean;
  currentUser: ICurrentUserRecord;
  deleteComment: (commentId: number) => void;
  commentCount: number;
  getMoreComments: () => void;
  isPageLoading: boolean;
}

function getMoreCommentsButton(props: ICommentsProps) {
  if (props.isPageLoading) {
    return (
      <div className={`${styles.moreButton} ${styles.isLoading}`}>
        <ButtonSpinner className={styles.buttonSpinner} />
        More Comments
      </div>
    );
  } else {
    return (
      <div onClick={props.getMoreComments} className={styles.moreButton}>
        More Comments
      </div>
    );
  }
}

const Comments = (props: ICommentsProps) => {
  const { comments, isCommentsOpen, currentUser, deleteComment, commentCount } = props;
  if (comments.size === 0) {
    return null;
  }

  const isCommentsSameLessThanMinimumShowingCommentNumber = comments.size <= MINIMUM_SHOWING_COMMENT_NUMBER;
  if (isCommentsSameLessThanMinimumShowingCommentNumber) {
    const commentItems = comments.map(comment => {
      return (
        <Comment
          key={`paper_comment_${comment.id}`}
          id={comment.id}
          comment={comment}
          isMine={currentUser.id === comment.createdBy.id}
          deleteComment={() => {
            deleteComment(comment.id);
          }}
        />
      );
    });
    return <div className={styles.comments}>{commentItems}</div>;
  } else if (!isCommentsOpen) {
    const commentItems = comments.slice(0, MINIMUM_SHOWING_COMMENT_NUMBER).map(comment => {
      return (
        <Comment
          key={`paper_comment_${comment.id}`}
          id={comment.id}
          comment={comment}
          isMine={currentUser.id === comment.createdBy.id}
          deleteComment={() => {
            deleteComment(comment.id);
          }}
        />
      );
    });

    return <div className={styles.comments}>{commentItems}</div>;
  } else if (!isCommentsSameLessThanMinimumShowingCommentNumber && isCommentsOpen) {
    const commentItems = comments.map(comment => {
      return (
        <Comment
          key={`paper_comment_${comment.id}`}
          id={comment.id}
          comment={comment}
          isMine={currentUser.id === comment.createdBy.id}
          deleteComment={() => {
            deleteComment(comment.id);
          }}
        />
      );
    });

    const isThereNoMoreComments = commentCount === comments.size;

    if (isThereNoMoreComments) {
      return <div className={styles.comments}>{commentItems}</div>;
    } else {
      return (
        <div className={styles.comments}>
          {commentItems}
          {getMoreCommentsButton(props)}
        </div>
      );
    }
  }
};

export default Comments;
