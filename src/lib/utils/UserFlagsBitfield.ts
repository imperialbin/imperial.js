import { Bitfield } from "./Bitfield";

export enum UserFlags {
	CanEncryptDocuments = 1 << 0,
	HighQualityScreenshots = 1 << 1,
	VanityUrl = 1 << 2,
	MemberPlusBadge = 1 << 3,
	BetaBadge = 1 << 4,
	AdminBadge = 1 << 5,
	BanUsers = 1 << 6,
}

export class UserFlagsBitfield extends Bitfield {
	static Flags = UserFlags;

	static DefaultBits = UserFlagsBitfield.Flags.CanEncryptDocuments;

	static BetaTester =
		UserFlagsBitfield.DefaultBits | UserFlagsBitfield.Flags.VanityUrl | UserFlagsBitfield.Flags.BetaBadge;

	static MemberPlus =
		UserFlagsBitfield.DefaultBits |
		UserFlagsBitfield.Flags.HighQualityScreenshots |
		UserFlagsBitfield.Flags.VanityUrl |
		UserFlagsBitfield.Flags.MemberPlusBadge;

	static Admin = UserFlagsBitfield.MemberPlus | UserFlagsBitfield.Flags.AdminBadge | UserFlagsBitfield.Flags.BanUsers;
}
