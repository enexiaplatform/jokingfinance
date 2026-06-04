import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Tác giả",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Tên",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "avatar",
      title: "Ảnh đại diện",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "bio",
      title: "Tiểu sử",
      type: "text",
      rows: 3,
    }),
  ],
});
