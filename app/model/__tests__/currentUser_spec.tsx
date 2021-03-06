import { recordifyCurrentUser, initialCurrentUser, ICurrentUser } from "../currentUser";
import { initialWallet, IWallet, WalletFactory } from "../wallet";
import { initialMemberOAuth, MemberOAuthFactory } from "../oauth";

describe("currentUser model", () => {
  describe("CurrentUserStateFactory function", () => {
    it("should return initial state when there is no param", () => {
      expect(recordifyCurrentUser().toJS()).toEqual(initialCurrentUser);
    });

    it("should return recordified state when there is no param", () => {
      expect(recordifyCurrentUser().toString()).toContain("Record");
    });

    describe("when there are params", () => {
      let mockUserObject: ICurrentUser;
      const mockIsLoggedIn: boolean = false;
      const mockOauthLoggedIn: boolean = false;
      const mockEmail: string = "tylor@pluto.network";
      const mockName: string = "TylorShin";
      const mockId: number = 123;
      const mockWallet: IWallet = initialWallet;
      const mockReputation: number = 13;
      const mockProfileImage: string = "https://test_profile_image.com";
      const mockInstitution: string = "Postech";
      const mockMajor: string = "CITE";
      const mockArticleCount = 3;
      const mockReviewCount = 2;
      const mockCommentCount = 4;
      const mockEmailVerified = false;
      const mockOauth = initialMemberOAuth;

      beforeEach(() => {
        mockUserObject = {
          isLoggedIn: mockIsLoggedIn,
          oauthLoggedIn: mockOauthLoggedIn,
          email: mockEmail,
          name: mockName,
          id: mockId,
          wallet: mockWallet,
          reputation: mockReputation,
          profileImage: mockProfileImage,
          affiliation: mockInstitution,
          major: mockMajor,
          articleCount: mockArticleCount,
          reviewCount: mockReviewCount,
          commentCount: mockCommentCount,
          emailVerified: mockEmailVerified,
          oauth: mockOauth,
        };
      });

      it("should return recordified state", () => {
        expect(recordifyCurrentUser(mockUserObject).toString()).toContain("Record");
      });

      it("should return same value with params value", () => {
        expect(recordifyCurrentUser(mockUserObject).toJS()).toEqual(mockUserObject);
      });

      it("should return same isLoggedIn with params", () => {
        expect(recordifyCurrentUser(mockUserObject).isLoggedIn).toEqual(mockIsLoggedIn);
      });

      it("should return same oauthLoggedIn with params", () => {
        expect(recordifyCurrentUser(mockUserObject).oauthLoggedIn).toEqual(mockOauthLoggedIn);
      });

      it("should return same email value with params", () => {
        expect(recordifyCurrentUser(mockUserObject).email).toEqual(mockEmail);
      });

      it("should return same name value with params", () => {
        expect(recordifyCurrentUser(mockUserObject).name).toEqual(mockName);
      });

      it("should return same id with params", () => {
        expect(recordifyCurrentUser(mockUserObject).id).toEqual(mockId);
      });

      it("should return same reputation with params", () => {
        expect(recordifyCurrentUser(mockUserObject).reputation).toEqual(mockReputation);
      });

      it("should return same profileImage with params", () => {
        expect(recordifyCurrentUser(mockUserObject).profileImage).toEqual(mockProfileImage);
      });

      it("should return same institution with params", () => {
        expect(recordifyCurrentUser(mockUserObject).affiliation).toEqual(mockInstitution);
      });

      it("should return same profileImage with params", () => {
        expect(recordifyCurrentUser(mockUserObject).major).toEqual(mockMajor);
      });

      it("should return recorded wallet with params", () => {
        expect(recordifyCurrentUser(mockUserObject).wallet).toEqual(WalletFactory(mockWallet));
      });

      it("should return same articleCount with params", () => {
        expect(recordifyCurrentUser(mockUserObject).articleCount).toEqual(mockArticleCount);
      });

      it("should return same reviewCount with params", () => {
        expect(recordifyCurrentUser(mockUserObject).reviewCount).toEqual(mockReviewCount);
      });

      it("should return same commentCount with params", () => {
        expect(recordifyCurrentUser(mockUserObject).commentCount).toEqual(mockCommentCount);
      });

      it("should return same emailVerified with params", () => {
        expect(recordifyCurrentUser(mockUserObject).emailVerified).toEqual(mockEmailVerified);
      });

      it("should return same oauth with params", () => {
        expect(recordifyCurrentUser(mockUserObject).oauth).toEqual(MemberOAuthFactory(mockOauth));
      });
    });
  });
});
