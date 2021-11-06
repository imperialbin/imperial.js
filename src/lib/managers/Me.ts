import type { Document as IDocument } from "../types/document";
import { Document } from "../classes/Document";
import { Base } from "../client/Base";
import type { MeUser } from "../types/me";
import { requireToken } from "../utils/decorators";

export class MeManager extends Base {
	/**
	 *  Show current user
	 */
	@requireToken
	public async get(): Promise<MeUser> {
		return this.client.rest.request<MeUser>("GET", "/user/@me");
	}

	/**
	 *  Show recent documents for the current user
	 */
	@requireToken
	public async recent(): Promise<Document[] | null> {
		const data = await this.client.rest.request<IDocument[]>("GET", "/user/@me/recentDocuments");

		if (!data) return null;

		return data.map((document) => new Document(this.client, document));
	}

	/**
	 *  Change the icon of the current user
	 */
	@requireToken
	public async setIcon(method: "github" | "gravatar", url: string): Promise<void> {
		await this.client.rest.request<MeUser>("PATCH", "/user/@me/icon", {
			data: {
				method,
				url,
			},
		});
	}
}
