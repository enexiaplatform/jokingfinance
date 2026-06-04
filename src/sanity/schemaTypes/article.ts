import { defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Bài học",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tiêu đề",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Đường dẫn",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Tóm tắt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Ảnh bìa",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "category",
      title: "Chuyên mục",
      type: "reference",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Thẻ",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "author",
      title: "Tác giả",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Thời điểm xuất bản",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "difficulty",
      title: "Độ khó",
      type: "string",
      options: {
        list: [
          { title: "Nhập môn", value: "beginner" },
          { title: "Trung cấp", value: "intermediate" },
          { title: "Nâng cao", value: "advanced" },
        ],
      },
      initialValue: "beginner",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "readingTime",
      title: "Thời gian đọc",
      type: "number",
      description: "Thời gian đọc ước tính theo phút.",
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "body",
      title: "Nội dung",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "relatedStocks",
      title: "Mã cổ phiếu liên quan",
      type: "array",
      of: [{ type: "string" }],
      description: "Mã cổ phiếu chỉ dùng làm ngữ cảnh học tập. Không trình bày như khuyến nghị.",
    }),
    defineField({
      name: "relatedMissionSlug",
      title: "Đường dẫn nhiệm vụ liên quan",
      type: "string",
    }),
    defineField({
      name: "status",
      title: "Trạng thái",
      type: "string",
      options: {
        list: [
          { title: "Bản nháp", value: "draft" },
          { title: "Đã xuất bản", value: "published" },
        ],
      },
      initialValue: "draft",
    }),
    defineField({
      name: "seoTitle",
      title: "Tiêu đề tìm kiếm",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "Mô tả tìm kiếm",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "disclaimer",
      title: "Tuyên bố giới hạn",
      type: "text",
      rows: 3,
      initialValue:
        "Nội dung này chỉ phục vụ mục đích giáo dục và mô phỏng. Đây không phải là khuyến nghị đầu tư.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category.title",
      media: "coverImage",
    },
  },
});
