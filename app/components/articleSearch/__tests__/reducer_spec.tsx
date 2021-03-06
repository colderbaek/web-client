jest.unmock("../reducer");
jest.unmock("../records");

import { reducer } from "../reducer";
import { ACTION_TYPES } from "../../../actions/actionTypes";
import {
  IArticleSearchStateRecord,
  ARTICLE_SEARCH_INITIAL_STATE,
  SEARCH_SORTING,
  initializeSearchItemsMeta,
} from "../records";
import { List } from "immutable";
import { initialPaper, recordifyPaper, IPaperRecord } from "../../../model/paper";
import { initialComment, IComment, ICommentRecord, recordifyComment } from "../../../model/comment";

function reduceState(action: any, state: IArticleSearchStateRecord = ARTICLE_SEARCH_INITIAL_STATE) {
  return reducer(state, action);
}

describe("articleSearch reducer", () => {
  let mockAction: any;
  let state: IArticleSearchStateRecord;

  describe("when receive ARTICLE_SEARCH_CHANGE_SEARCH_INPUT", () => {
    it("should set searchInput following searchInput payload", () => {
      const mockSearchInput = "paper";

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SEARCH_INPUT,
        payload: {
          searchInput: mockSearchInput,
        },
      };

      state = reduceState(mockAction);

      expect(state.searchInput).toEqual(mockSearchInput);
    });
  });

  describe("when receive ARTICLE_SEARCH_CHANGE_SORTING", () => {
    it("should set sorting following sorting payload", () => {
      const mockSorting: SEARCH_SORTING = SEARCH_SORTING.RELEVANCE;

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_SORTING,
        payload: {
          sorting: mockSorting,
        },
      };

      state = reduceState(mockAction);

      expect(state.sorting).toEqual(mockSorting);
    });
  });

  describe("when receive ARTICLE_SEARCH_START_TO_GET_PAPERS", () => {
    beforeEach(() => {
      mockAction = { type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_PAPERS };

      state = reduceState(mockAction);
    });

    it("should set isLoading to true", () => {
      expect(state.isLoading).toBeTruthy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });
  });

  describe("when receive ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS", () => {
    const mockPapers = List();
    const mockPage = 3;
    const mockIsEnd = false;
    const mockTotalElements = 3;
    const mockTotalPages = 23;
    const mockNumberOfElements = 32;

    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_PAPERS,
        payload: {
          papers: mockPapers,
          nextPage: mockPage + 1,
          isEnd: mockIsEnd,
          totalElements: mockTotalElements,
          totalPages: mockTotalPages,
          numberOfElements: mockNumberOfElements,
        },
      };

      state = reduceState(mockAction);
    });

    it("should set isEnd following isEnd payload", () => {
      expect(state.isEnd).toEqual(mockIsEnd);
    });

    it("should set page following nextPage payload", () => {
      expect(state.page).toEqual(mockPage + 1);
    });

    it("should set searchItemsToShow following papers payload", () => {
      expect(state.searchItemsToShow).toEqual(mockPapers);
    });

    it("should set searchItemsMeta following recordifed initializesearchItemsMeta with numberOfElements payload value", () => {
      expect(JSON.stringify(state.searchItemsMeta)).toEqual(
        JSON.stringify(initializeSearchItemsMeta(mockNumberOfElements)),
      );
    });

    it("should set totalElements following totalElements payload", () => {
      expect(state.totalElements).toEqual(mockTotalElements);
    });

    it("should set totalPages following totalPages payload", () => {
      expect(state.totalPages).toEqual(mockTotalPages);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });

    it("should set targetPaper to null", () => {
      expect(state.targetPaper).toBeNull();
    });
  });

  describe("when receive ARTICLE_SEARCH_FAILED_TO_GET_PAPERS", () => {
    beforeEach(() => {
      mockAction = { type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_PAPERS };

      state = reduceState(mockAction);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to true", () => {
      expect(state.hasError).toBeTruthy();
    });
  });

  describe("when receive ARTICLE_SEARCH_SUCCEEDED_TO_DELETE_COMMENT", () => {
    it("should remove following paper's comment", () => {
      const mockPaperId = 23;
      const mockCommentId = 4;
      const mockComment: IComment = {
        ...initialComment,
        id: mockCommentId,
        paperId: mockPaperId,
      };
      const mockPaper = recordifyPaper({
        ...initialPaper,
        id: mockPaperId,
        comments: [mockComment],
      });

      const mockState = ARTICLE_SEARCH_INITIAL_STATE.set("searchItemsToShow", List([mockPaper]));

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_DELETE_COMMENT,
        payload: {
          paperId: mockPaperId,
          commentId: mockCommentId,
        },
      };

      state = reduceState(mockAction, mockState);

      const paperKey = state.searchItemsToShow.findKey((paper: IPaperRecord) => {
        return paper.id === mockPaperId;
      });

      const commentKey = state.searchItemsToShow.getIn([paperKey, "comments"]).findKey((comment: ICommentRecord) => {
        return comment.id === mockCommentId;
      });
      expect(state.getIn(["searchItemsToShow", mockPaperId, "comments", commentKey])).toBeUndefined();
    });
  });

  describe("when receive ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS", () => {
    beforeEach(() => {
      mockAction = { type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_REFERENCE_PAPERS };

      state = reduceState(mockAction);
    });

    it("should set isLoading to true", () => {
      expect(state.isLoading).toBeTruthy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });
  });

  describe("when receive ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS", () => {
    beforeEach(() => {
      mockAction = { type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_CITED_PAPERS };

      state = reduceState(mockAction);
    });

    it("should set isLoading to true", () => {
      expect(state.isLoading).toBeTruthy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });
  });

  describe("when receive ARTICLE_SEARCH_SUCCEEDED_TO_GET_REFERENCE_PAPERS", () => {
    const mockPapers = List();
    const mockPage = 3;
    const mockIsEnd = false;
    const mockTotalElements = 3;
    const mockTotalPages = 23;
    const mockNumberOfElements = 32;
    const mockTargetPaper = initialPaper;

    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_REFERENCE_PAPERS,
        payload: {
          papers: mockPapers,
          nextPage: mockPage + 1,
          isEnd: mockIsEnd,
          totalElements: mockTotalElements,
          totalPages: mockTotalPages,
          numberOfElements: mockNumberOfElements,
          targetPaper: mockTargetPaper,
        },
      };

      state = reduceState(mockAction);
    });

    it("should set isEnd following isEnd payload", () => {
      expect(state.isEnd).toEqual(mockIsEnd);
    });

    it("should set page following nextPage payload", () => {
      expect(state.page).toEqual(mockPage + 1);
    });

    it("should set searchItemsToShow following papers payload", () => {
      expect(state.searchItemsToShow).toEqual(mockPapers);
    });

    it("should set searchItemsMeta following recordifed initializesearchItemsMeta with numberOfElements payload value", () => {
      expect(JSON.stringify(state.searchItemsMeta)).toEqual(
        JSON.stringify(initializeSearchItemsMeta(mockNumberOfElements)),
      );
    });

    it("should set totalElements following totalElements payload", () => {
      expect(state.totalElements).toEqual(mockTotalElements);
    });

    it("should set totalPages following totalPages payload", () => {
      expect(state.totalPages).toEqual(mockTotalPages);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });

    it("should set targetPaper following targetPaper payload", () => {
      expect(state.targetPaper).toEqual(mockTargetPaper);
    });
  });

  describe("when receive ARTICLE_SEARCH_SUCCEEDED_TO_GET_CITED_PAPERS", () => {
    const mockPapers = List();
    const mockPage = 3;
    const mockIsEnd = false;
    const mockTotalElements = 3;
    const mockTotalPages = 23;
    const mockNumberOfElements = 32;
    const mockTargetPaper = initialPaper;

    beforeEach(() => {
      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_CITED_PAPERS,
        payload: {
          papers: mockPapers,
          nextPage: mockPage + 1,
          isEnd: mockIsEnd,
          totalElements: mockTotalElements,
          totalPages: mockTotalPages,
          numberOfElements: mockNumberOfElements,
          targetPaper: mockTargetPaper,
        },
      };

      state = reduceState(mockAction);
    });

    it("should set isEnd following isEnd payload", () => {
      expect(state.isEnd).toEqual(mockIsEnd);
    });

    it("should set page following nextPage payload", () => {
      expect(state.page).toEqual(mockPage + 1);
    });

    it("should set searchItemsToShow following papers payload", () => {
      expect(state.searchItemsToShow).toEqual(mockPapers);
    });

    it("should set searchItemsMeta following recordifed initializesearchItemsMeta with numberOfElements payload value", () => {
      expect(JSON.stringify(state.searchItemsMeta)).toEqual(
        JSON.stringify(initializeSearchItemsMeta(mockNumberOfElements)),
      );
    });

    it("should set totalElements following totalElements payload", () => {
      expect(state.totalElements).toEqual(mockTotalElements);
    });

    it("should set totalPages following totalPages payload", () => {
      expect(state.totalPages).toEqual(mockTotalPages);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to false", () => {
      expect(state.hasError).toBeFalsy();
    });

    it("should set targetPaper following targetPaper payload", () => {
      expect(state.targetPaper).toEqual(mockTargetPaper);
    });
  });

  describe("when receive ARTICLE_SEARCH_FAILED_TO_GET_REFERENCE_PAPERS", () => {
    beforeEach(() => {
      mockAction = { type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_REFERENCE_PAPERS };

      state = reduceState(mockAction);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to true", () => {
      expect(state.hasError).toBeTruthy();
    });
  });

  describe("when receive ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS", () => {
    beforeEach(() => {
      mockAction = { type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_CITED_PAPERS };

      state = reduceState(mockAction);
    });

    it("should set isLoading to false", () => {
      expect(state.isLoading).toBeFalsy();
    });

    it("should set hasError to true", () => {
      expect(state.hasError).toBeTruthy();
    });
  });

  describe("when receive ARTICLE_SEARCH_CHANGE_COMMENT_INPUT", () => {
    it("should set searchItemsMeta's commentInput following index & comment payload", () => {
      const mockIndex = 0;
      const mockCommentContent = "test";
      const mockPaperId = 23;
      const mockCommentId = 4;
      const mockComment: IComment = {
        ...initialComment,
        id: mockCommentId,
        paperId: mockPaperId,
      };
      const mockPaper = recordifyPaper({
        ...initialPaper,
        id: mockPaperId,
        comments: [mockComment],
      });

      const mockState = ARTICLE_SEARCH_INITIAL_STATE.set("searchItemsToShow", List([mockPaper]));

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_CHANGE_COMMENT_INPUT,
        payload: {
          index: mockIndex,
          comment: mockCommentContent,
        },
      };

      state = reduceState(mockAction, mockState);

      expect(state.getIn(["searchItemsMeta", mockIndex, "commentInput"])).toEqual(mockCommentContent);
    });
  });

  describe("when receive ARTICLE_SEARCH_TOGGLE_ABSTRACT", () => {
    it("should set searchItemsMeta's isAbstractOpen to counter default value following index payload", () => {
      const mockIndex = 0;
      const mockIsAbstractOpen = false;
      const mocksearchItemsMeta = initializeSearchItemsMeta(1).setIn([mockIndex, "isAbstractOpen"], mockIsAbstractOpen);

      const mockState = ARTICLE_SEARCH_INITIAL_STATE.set("searchItemsMeta", mocksearchItemsMeta);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_ABSTRACT,
        payload: {
          index: mockIndex,
        },
      };

      state = reduceState(mockAction, mockState);

      expect(state.getIn(["searchItemsMeta", mockIndex, "isAbstractOpen"])).toEqual(!mockIsAbstractOpen);
    });
  });

  describe("when receive ARTICLE_SEARCH_TOGGLE_COMMENTS", () => {
    it("should set searchItemsMeta's isCommentsOpen to counter default value following index payload", () => {
      const mockIndex = 0;
      const mockIsCommentsOpen = false;
      const mocksearchItemsMeta = initializeSearchItemsMeta(1).setIn([mockIndex, "isCommentsOpen"], mockIsCommentsOpen);

      const mockState = ARTICLE_SEARCH_INITIAL_STATE.set("searchItemsMeta", mocksearchItemsMeta);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_COMMENTS,
        payload: {
          index: mockIndex,
        },
      };

      state = reduceState(mockAction, mockState);

      expect(state.getIn(["searchItemsMeta", mockIndex, "isCommentsOpen"])).toEqual(!mockIsCommentsOpen);
    });
  });

  describe("when receive ARTICLE_SEARCH_TOGGLE_AUTHORS", () => {
    it("should set searchItemsMeta's isAuthorsOpen to counter default value following index payload", () => {
      const mockIndex = 0;
      const mockIsAuthorsOpen = false;
      const mocksearchItemsMeta = initializeSearchItemsMeta(1).setIn([mockIndex, "isAuthorsOpen"], mockIsAuthorsOpen);

      const mockState = ARTICLE_SEARCH_INITIAL_STATE.set("searchItemsMeta", mocksearchItemsMeta);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_TOGGLE_AUTHORS,
        payload: {
          index: mockIndex,
        },
      };

      state = reduceState(mockAction, mockState);

      expect(state.getIn(["searchItemsMeta", mockIndex, "isAuthorsOpen"])).toEqual(!mockIsAuthorsOpen);
    });
  });

  describe("when receive ARTICLE_SEARCH_VISIT_TITLE", () => {
    it("should set searchItemsMeta's isTitleVisited to true following index payload", () => {
      const mockIndex = 0;
      const mocksearchItemsMeta = initializeSearchItemsMeta(1).setIn([mockIndex, "isTitleVisited"], false);

      const mockState = ARTICLE_SEARCH_INITIAL_STATE.set("searchItemsMeta", mocksearchItemsMeta);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_VISIT_TITLE,
        payload: {
          index: mockIndex,
        },
      };

      state = reduceState(mockAction, mockState);

      expect(state.getIn(["searchItemsMeta", mockIndex, "isTitleVisited"])).toBeTruthy();
    });
  });

  describe("when receive ARTICLE_SEARCH_CLOSE_FIRST_OPEN", () => {
    it("should set searchItemsMeta's isFirstOpen to false following index payload", () => {
      const mockIndex = 0;
      const mocksearchItemsMeta = initializeSearchItemsMeta(1).setIn([mockIndex, "isFirstOpen"], true);

      const mockState = ARTICLE_SEARCH_INITIAL_STATE.set("searchItemsMeta", mocksearchItemsMeta);

      mockAction = {
        type: ACTION_TYPES.ARTICLE_SEARCH_CLOSE_FIRST_OPEN,
        payload: {
          index: mockIndex,
        },
      };

      state = reduceState(mockAction, mockState);

      expect(state.getIn(["searchItemsMeta", mockIndex, "isFirstOpen"])).toBeFalsy();
    });
  });

  describe("when receive ARTICLE_SEARCH_START_TO_POST_COMMENT", () => {
    describe("There is a paper that has paperId following payload ", () => {
      const mockPaperId = 23;
      const mockPaper = recordifyPaper({
        ...initialPaper,
        id: mockPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state.set("searchItemsToShow", List([mockPaper])).set("searchItemsMeta", initializeSearchItemsMeta(1));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_POST_COMMENT,
          payload: {
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("should set searchItemsMeta's hasError to false", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "hasError"])).toBeFalsy();
      });

      it("should set searchItemsMeta's isLoading to true", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "isLoading"])).toBeTruthy();
      });
    });

    describe("There is no paper that has paperId following payload", () => {
      const mockInValidPaperId = 43;
      const mockPaperId = 23;
      const mockPaper = recordifyPaper({
        ...initialPaper,
        id: mockInValidPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state.set("searchItemsToShow", List([mockPaper])).set("searchItemsMeta", initializeSearchItemsMeta(1));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_POST_COMMENT,
          payload: {
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("mockKey should be undefined", () => {
        expect(mockKey).toBeUndefined();
      });

      it("should set state to initial mockState", () => {
        expect(state).toEqual(mockState);
      });
    });
  });

  describe("when receive ARTICLE_SEARCH_SUCCEEDED_TO_POST_COMMENT", () => {
    describe("There is a paper that has paperId following payload ", () => {
      const mockPaperId = 23;
      const mockCommentId = 4;
      const mockComment: IComment = {
        ...initialComment,
        id: mockCommentId,
        paperId: mockPaperId,
      };
      const mockPaper = recordifyPaper({
        ...initialPaper,
        id: mockPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state.set("searchItemsToShow", List([mockPaper])).set("searchItemsMeta", initializeSearchItemsMeta(1));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_POST_COMMENT,
          payload: {
            comment: recordifyComment(mockComment),
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("should set searchItemsToShow's comments to be unshifted with comment payload", () => {
        const newComments = List([recordifyComment(mockComment)]);
        expect(JSON.stringify(state.getIn(["searchItemsToShow", mockKey, "comments"]))).toEqual(
          JSON.stringify(newComments),
        );
      });

      it("should set searchItemsToShow's commentCount to previous value + 1", () => {
        const previousCommentCount = 0;
        expect(state.getIn(["searchItemsToShow", mockKey, "commentCount"])).toEqual(previousCommentCount + 1);
      });

      it("should set searchItemsMeta's hasError to false", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "hasError"])).toBeFalsy();
      });

      it("should set searchItemsMeta's isLoading to false", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "isLoading"])).toBeFalsy();
      });

      it("should set searchItemsMeta's commentInput to empty string", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "commentInput"])).toEqual("");
      });
    });

    describe("There is no paper that has paperId following payload", () => {
      const mockInValidPaperId = 43;
      const mockPaperId = 23;
      const mockCommentId = 4;
      const mockComment: IComment = {
        ...initialComment,
        id: mockCommentId,
        paperId: mockInValidPaperId,
      };
      const mockPaper = recordifyPaper({
        ...initialPaper,
        id: mockInValidPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state.set("searchItemsToShow", List([mockPaper])).set("searchItemsMeta", initializeSearchItemsMeta(1));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_POST_COMMENT,
          payload: {
            comment: recordifyComment(mockComment),
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("mockKey should be undefined", () => {
        expect(mockKey).toBeUndefined();
      });

      it("should set state to initial mockState", () => {
        expect(state).toEqual(mockState);
      });
    });
  });

  describe("when receive ARTICLE_SEARCH_FAILED_TO_POST_COMMENT", () => {
    describe("There is a paper that has paperId following payload ", () => {
      const mockPaperId = 23;
      const mockPaper = recordifyPaper({
        ...initialPaper,
        id: mockPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state.set("searchItemsToShow", List([mockPaper])).set("searchItemsMeta", initializeSearchItemsMeta(1));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_POST_COMMENT,
          payload: {
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("should set searchItemsMeta's hasError to true", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "hasError"])).toBeTruthy();
      });

      it("should set searchItemsMeta's isLoading to false", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "isLoading"])).toBeFalsy();
      });
    });

    describe("There is no paper that has paperId following payload", () => {
      const mockInValidPaperId = 43;
      const mockPaperId = 23;
      const mockPaper = recordifyPaper({
        ...initialPaper,
        id: mockInValidPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state.set("searchItemsToShow", List([mockPaper])).set("searchItemsMeta", initializeSearchItemsMeta(1));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_POST_COMMENT,
          payload: {
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("mockKey should be undefined", () => {
        expect(mockKey).toBeUndefined();
      });

      it("should set state to initial mockState", () => {
        expect(state).toEqual(mockState);
      });
    });
  });

  describe("when receive ARTICLE_SEARCH_START_TO_GET_MORE_COMMENTS", () => {
    describe("There is a paper that has paperId following payload ", () => {
      const mockPaperId = 23;
      const mockPaper = recordifyPaper({
        ...initialPaper,
        id: mockPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state.set("searchItemsToShow", List([mockPaper])).set("searchItemsMeta", initializeSearchItemsMeta(1));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_MORE_COMMENTS,
          payload: {
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("should set searchItemsMeta's hasError to false", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "hasError"])).toBeFalsy();
      });

      it("should set searchItemsMeta's isPageLoading to true", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "isPageLoading"])).toBeTruthy();
      });
    });

    describe("There is no paper that has paperId following payload", () => {
      const mockInValidPaperId = 43;
      const mockPaperId = 23;
      const mockPaper = recordifyPaper({
        ...initialPaper,
        id: mockInValidPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state.set("searchItemsToShow", List([mockPaper])).set("searchItemsMeta", initializeSearchItemsMeta(1));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_START_TO_GET_MORE_COMMENTS,
          payload: {
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("mockKey should be undefined", () => {
        expect(mockKey).toBeUndefined();
      });

      it("should set state to initial mockState", () => {
        expect(state).toEqual(mockState);
      });
    });
  });

  describe("when receive ARTICLE_SEARCH_SUCCEEDED_TO_GET_MORE_COMMENTS", () => {
    describe("There is a paper that has paperId following payload ", () => {
      const mockPaperId = 23;
      const mockPage = 2;
      const mockCommentId = 4;
      const mockComment: IComment = {
        ...initialComment,
        id: mockCommentId,
        paperId: mockPaperId,
      };
      const mockComments: List<ICommentRecord> = List([recordifyComment(mockComment)]);
      const mockPaper = recordifyPaper({
        ...initialPaper,
        id: mockPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state.set("searchItemsToShow", List([mockPaper])).set("searchItemsMeta", initializeSearchItemsMeta(1));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_MORE_COMMENTS,
          payload: {
            paperId: mockPaperId,
            comments: mockComments,
            nextPage: mockPage + 1,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("should set searchItemsToShow's comments to be concated with comments payload", () => {
        const newComments = List([]).concat(mockComments);
        expect(JSON.stringify(state.getIn(["searchItemsToShow", mockKey, "comments"]))).toEqual(
          JSON.stringify(newComments),
        );
      });

      it("should set searchItemsMeta's page to nextPage", () => {
        const nextPage = mockPage + 1;
        expect(state.getIn(["searchItemsMeta", mockKey, "page"])).toEqual(nextPage);
      });

      it("should set searchItemsMeta's hasError to false", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "hasError"])).toBeFalsy();
      });

      it("should set searchItemsMeta's isPageLoading to false", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "isPageLoading"])).toBeFalsy();
      });
    });

    describe("There is no paper that has paperId following payload", () => {
      const mockInValidPaperId = 43;
      const mockPaperId = 23;
      const mockPage = 2;
      const mockCommentId = 4;
      const mockComment: IComment = {
        ...initialComment,
        id: mockCommentId,
        paperId: mockInValidPaperId,
      };
      const mockComments: List<ICommentRecord> = List([recordifyComment(mockComment)]);
      const mockPaper = recordifyPaper({
        ...initialPaper,
        id: mockInValidPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state.set("searchItemsToShow", List([mockPaper])).set("searchItemsMeta", initializeSearchItemsMeta(1));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_SUCCEEDED_TO_GET_MORE_COMMENTS,
          payload: {
            paperId: mockPaperId,
            comments: mockComments,
            nextPage: mockPage + 1,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("mockKey should be undefined", () => {
        expect(mockKey).toBeUndefined();
      });

      it("should set state to initial mockState", () => {
        expect(state).toEqual(mockState);
      });
    });
  });

  describe("when receive ARTICLE_SEARCH_FAILED_TO_GET_MORE_COMMENTS", () => {
    describe("There is a paper that has paperId following payload ", () => {
      const mockPaperId = 23;
      const mockPaper = recordifyPaper({
        ...initialPaper,
        id: mockPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state.set("searchItemsToShow", List([mockPaper])).set("searchItemsMeta", initializeSearchItemsMeta(1));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_MORE_COMMENTS,
          payload: {
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("should set searchItemsMeta's hasError to true", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "hasError"])).toBeTruthy();
      });

      it("should set searchItemsMeta's isPageLoading to false", () => {
        expect(state.getIn(["searchItemsMeta", mockKey, "isPageLoading"])).toBeFalsy();
      });
    });

    describe("There is no paper that has paperId following payload", () => {
      const mockInValidPaperId = 43;
      const mockPaperId = 23;
      const mockPaper = recordifyPaper({
        ...initialPaper,
        id: mockInValidPaperId,
        comments: [],
      });
      const mockState = ARTICLE_SEARCH_INITIAL_STATE.withMutations(state => {
        state.set("searchItemsToShow", List([mockPaper])).set("searchItemsMeta", initializeSearchItemsMeta(1));
      });
      let mockKey: number;

      beforeEach(() => {
        mockAction = {
          type: ACTION_TYPES.ARTICLE_SEARCH_FAILED_TO_GET_MORE_COMMENTS,
          payload: {
            paperId: mockPaperId,
          },
        };

        state = reduceState(mockAction, mockState);
        mockKey = state.searchItemsToShow.findKey(paper => {
          return paper.id === mockPaperId;
        });
      });

      it("mockKey should be undefined", () => {
        expect(mockKey).toBeUndefined();
      });

      it("should set state to initial mockState", () => {
        expect(state).toEqual(mockState);
      });
    });
  });

  describe("when receive except action", () => {
    it("should set state to state", () => {
      mockAction = {
        type: ACTION_TYPES.SIGN_IN_FAILED_TO_SIGN_IN,
      };

      state = reduceState(mockAction);

      expect(state).toEqual(state);
    });
  });
});
