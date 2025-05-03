import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import Editor from "@ckeditor/ckeditor5-build-classic";
import _ from "lodash"

const CKEditor5 = (props) => {
  return (
    <div className="ckrte">
      <CKEditor
        onReady={(editor) => {
          editor.editing.view.change((writer) => {
            writer.setStyle(
              "height",
              "300px",
              editor.editing.view.document.getRoot()
            );
          });
          editor.isReadOnly = props.disabled;
        }}
        config={{
          toolbar: {
            items: [
              "bold",
              "italic",
              "heading",
              "bulletedList",
              "fontColor",
              "fontSize",
              "|",
              "undo",
              "redo",
              "|",
              "|",
              "sourceEditing",
              "|",
              "insertTable",
            ],
            shouldNotGroupWhenFull: true,
          },
          link: {
            decorators: {
              openInNewTab: {
                mode: "manual",
                label: "Open in a new tab",
                attributes: {
                  target: "_blank",
                  rel: "noopener noreferrer",
                },
              },
            },
          },
          fontSize: {
            options: ["12px", "14px", "16px", "18px", "23px", "32px"].map(
              (val) => ({
                model: val,
                title: `${val}`,
                view: { name: "span" },
              })
            ),
            supportAllValues: true,
          },
          heading: {
            options: [
              {
                model: "heading1",
                view: "h1",
                title: "Heading 1",
                class: "ck-heading_heading1",
              },
              {
                model: "heading2",
                view: "h2",
                title: "Heading 2",
                class: "ck-heading_heading2",
              },
              {
                model: "heading3",
                view: "h3",
                title: "Heading 3",
                class: "ck-heading_heading3",
              },
              {
                model: "heading4",
                view: "h4",
                title: "Heading 4",
                class: "ck-heading_heading4",
              },
              {
                model: "heading5",
                view: "h5",
                title: "Heading 5",
                class: "ck-heading_heading5",
              },
              {
                model: "heading6",
                view: "h6",
                title: "Heading 6",
                class: "ck-heading_heading6",
              },
              {
                model: "paragraph",
                title: "Paragraph",
                class: "ck-heading_paragraph",
              },
              { model: "small", view: "small", title: "Small" },
              { model: "span", view: "span", title: "Span" },
            ],
          },
        }}
        editor={Editor}
        data={props.data}
        onChange={props.onChange}
      />
      <span className="text-danger" style={{ fontSize: 14 }}>
        {props.errors?.length > 0 &&
          _.find(props.errors, (obj) => obj.field === props.context)
            ?.message}{" "}
      </span>
    </div>
  );
};

export default CKEditor5;
