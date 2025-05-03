import React from "react";
import ReactTable from "react-table";

import { useTranslation } from "react-i18next";

export default function Table({ pageSize, data, columns, showPagination }) {
  const { t } = useTranslation();
  return (
    <>
      <ReactTable
        pageSize={pageSize}
        rowsText={t("general.rows")}
        data={data}
        columns={columns}
        showPagination={showPagination}
      />
    </>
  );
}
