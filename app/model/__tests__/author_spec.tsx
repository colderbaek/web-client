import { initialAuthor, IAuthor, recordifyAuthor } from "../author";
import { RAW, RECORD } from "../../__mocks__";
import { IMember } from "../member";

describe("Author record model", () => {
  let mockAuthor: IAuthor;
  let mockOrganization: string;
  let mockName: string;
  let mockMember: IMember;

  describe("recordifyAuthor", () => {
    describe("when there is no params", () => {
      it("should return recordified state", () => {
        expect(
          recordifyAuthor()
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same value with initial state", () => {
        expect(recordifyAuthor().toJS()).toEqual(initialAuthor);
      });
    });

    describe("when there are params with member who doesn't have wallet", () => {
      beforeEach(() => {
        (mockOrganization = "pluto network"), (mockName = "TylorShin");
        mockMember = RAW.MEMBER;

        mockAuthor = {
          organization: mockOrganization,
          name: mockName,
          member: mockMember,
        };
      });

      it("should return recoridfied state", () => {
        expect(
          recordifyAuthor(mockAuthor)
            .toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return recordifed member", () => {
        expect(
          recordifyAuthor(mockAuthor)
            .member.toString()
            .slice(0, 6),
        ).toEqual("Record");
      });

      it("should return same name value with params name", () => {
        expect(recordifyAuthor(mockAuthor).name).toEqual(mockName);
      });

      it("should return same organization value with params organization", () => {
        expect(recordifyAuthor(mockAuthor).organization).toEqual(mockOrganization);
      });

      describe("when member's wallet is empty", () => {
        it("should return wallet values", () => {
          expect(recordifyAuthor(mockAuthor).member.email).toEqual("test@postech.ac.kr");
        });

        it("should return member with empty wallet", () => {
          expect(recordifyAuthor(mockAuthor).member.wallet).toBeNull();
        });
      });

      describe("when member's wallet isn't empty", () => {
        beforeEach(() => {
          const mockMemberWithWallet = { ...RAW.MEMBER, ...{ wallet: RAW.WALLET } };

          mockAuthor = {
            organization: mockOrganization,
            name: mockName,
            member: mockMemberWithWallet,
          };
        });

        it("should return member with recordifed wallet", () => {
          expect(recordifyAuthor(mockAuthor).member.wallet).toEqual(RECORD.WALLET);
        });
      });
    });
  });
});