export class CommentDTO {
    readonly comment_id: string
    readonly comment_parent_id?: string
    readonly post_id: string
    readonly from_id: string
    readonly from_name: string
    readonly message: string
    readonly attachments: any
    readonly publish_time: Date
}