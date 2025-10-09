import { Button, Col, Input, Row, Select, Table, Card, Spin } from "antd";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import React from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	ReferenceLine,
} from "recharts";
import "./index.scss";

// Helper function to format date based on period
const formatDateByPeriod = (date, period) => {
	if (!date) return null;

	switch (period) {
		case "daily":
			return dayjs(date).format("YYYY-MM-DD");
		case "monthly":
			return dayjs(date).format("YYYY-MM");
		case "yearly":
			return dayjs(date).format("YYYY");
		case "lifetime":
			return dayjs(date).format("YYYY"); // Year format for lifetime
		default:
			return dayjs(date).format("YYYY-MM-DD");
	}
};

function TableContent({
	loading,
	currentPage,
	pageSize,
	pshReportData,
	handleTableChange,
	searchName,
	setSearchName,
	getPSHReport,
	exportPSHReport,
	pshReportMeta,
	brand,
	setBrand,
	stationName,
	setStationName,
	classification,
	setClassification,
	statisticalPeriod,
	setStatisticalPeriod,
	selectedPeriod,
	setSelectedPeriod,
}) {
	const [selectedStation, setSelectedStation] = React.useState(null);
	const [chartData, setChartData] = React.useState([]);
	const [showChart, setShowChart] = React.useState(false);
	const [hasSearched, setHasSearched] = React.useState(false);

	// Prepare chart data when station is selected and search has been performed
	React.useEffect(() => {
		if (
			stationName &&
			pshReportData &&
			pshReportData.length > 0 &&
			hasSearched
		) {
			const chartData = pshReportData
				.map((item) => ({
					day: dayjs(item.collect_time || item.date).format("DD"),
					psh: parseFloat(item.specific_energy || 0),
					date: item.collect_time || item.date,
				}))
				.sort((a, b) => new Date(a.date) - new Date(b.date));

			setChartData(chartData);
			setShowChart(true);
			setSelectedStation(stationName);
		} else if (!hasSearched) {
			setShowChart(false);
			setSelectedStation(null);
		}
	}, [stationName, pshReportData, hasSearched]);

	// Handle station name click from table
	const handleStationClick = (stationName) => {
		setStationName(stationName);
		setHasSearched(true);
		// Trigger search with limit 31 for daily data
		getPSHReport({
			page: 1,
			limit: 31,
			inverterBrand: brand,
			stationName: stationName,
			classification,
			period: selectedPeriod.toLowerCase(),
			date: formatDateByPeriod(statisticalPeriod, selectedPeriod.toLowerCase()),
		});
	};

	// Brand options
	const brandOptions = [
		{ value: "", label: "All" },
		{ value: "fusionsolar", label: "FusionSolar" },
		{ value: "soliscloud", label: "SolisCloud" },
		{ value: "sungrow", label: "Sungrow" },
		{ value: "goodwe", label: "GoodWe" },
		{ value: "growatt", label: "Growatt" },
	];

	// Classification options
	const classificationOptions = [
		{ value: "", label: "All" },
		{ value: "good", label: "Good" },
		{ value: "bad", label: "Bad" },
	];

	// Period options for date picker
	const periodOptions = [
		{ value: "daily", label: "Daily" },
		{ value: "monthly", label: "Monthly" },
	];

	// Table columns for PSH report
	const pshReportColumns = [
		{
			title: "Plant Name",
			dataIndex: "station_name",
			key: "station_name",
			ellipsis: true,
			width: 250,
			render: (text, record) => (
				<span
					style={{
						color: "#1890ff",
						cursor: "pointer",
						textDecoration: "underline",
					}}
					onClick={() => handleStationClick(text)}>
					{text}
				</span>
			),
		},
		{
			title: "Address",
			dataIndex: "station_address",
			key: "station_address",
			ellipsis: true,
			width: 300,
		},
		{
			title: "PSH",
			dataIndex: "specific_energy",
			key: "specific_energy",
			render: (text) => <span>{text ? parseFloat(text).toFixed(3) : "-"}</span>,
			width: 120,
			sorter: true,
		},
		{
			title: "Classification",
			dataIndex: "psh_class",
			key: "psh_class",
			sorter: true,
			render: (value) => {
				if (!value) return "-";
				return (
					<span className={`classification-badge ${value.toLowerCase()}`}>
						{value.charAt(0).toUpperCase() + value.slice(1)}
					</span>
				);
			},
		},
	];

	const chartConfig = {
		threshold: 3.2,
		yAxisLabel: "PSH",
		xAxisLabel: "DAY",
		chartTitle: "PSH",
	};

	return (
		<>
			<Row gutter={[16, 16]}>
				<Col xs={24} className="white-background-panel">
					<div className="psh-report-panel">
						<div className="psh-report-header">
							<div className="search-filters">
								<Row gutter={[16, 16]} align="bottom" style={{ zIndex: 'unset'}}>
									<Col xs={24} sm={12} md={8} lg={6} className="filter-item">
										<label>Brand</label>
										<Select
											placeholder="All"
											style={{ width: "100%" }}
											value={brand}
											onChange={setBrand}
											options={brandOptions}
										/>
									</Col>
									<Col xs={24} sm={12} md={8} lg={6} className="filter-item">
										<label>Station Name</label>
										<Input
											placeholder="Enter station name"
											style={{ width: "100%" }}
											value={stationName}
											onChange={(e) => setStationName(e.target.value)}
										/>
									</Col>
									<Col xs={24} sm={12} md={8} lg={6} className="filter-item">
										<label>Classification</label>
										<Select
											placeholder="All"
											style={{ width: "100%" }}
											value={classification}
											onChange={setClassification}
											options={classificationOptions}
										/>
									</Col>
									<Col xs={24} sm={12} md={8} lg={6} className="filter-item">
										<label>Period</label>
										<Select
											placeholder="Select period"
											style={{ width: "100%" }}
											value={selectedPeriod}
											onChange={(value) => {
												setSelectedPeriod(value);
												if (value === "daily") {
													setStatisticalPeriod(new Date());
												} else {
													setStatisticalPeriod(null);
												}
											}}
											options={periodOptions}
										/>
									</Col>
									<Col xs={24} sm={12} md={8} lg={6} className="filter-item">
										<label>Date</label>
										{selectedPeriod === "monthly" && (
											<DatePicker
												selected={statisticalPeriod}
												onChange={(date) => setStatisticalPeriod(date)}
												showMonthYearPicker
												dateFormat="MM/yyyy"
												className="form-control"
												maxDate={new Date()}
												placeholderText="Select month"
												style={{ width: "100%" }}
											/>
										)}
										{selectedPeriod === "daily" && (
											<DatePicker
												selected={statisticalPeriod}
												onChange={(date) => setStatisticalPeriod(date)}
												dateFormat="yyyy-MM-dd"
												className="form-control"
												maxDate={new Date()}
												placeholderText="Select date"
												style={{ width: "100%" }}
											/>
										)}
									</Col>
									<Col
										span={24}
										style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
										<Button
											type="primary"
											onClick={() => {
												setHasSearched(true);
												getPSHReport({
													page: 1,
													limit: stationName ? 31 : 10, // Use limit 31 when searching by station name
													inverterBrand: brand,
													stationName,
													classification,
													period: selectedPeriod.toLowerCase(),
													date: formatDateByPeriod(
														statisticalPeriod,
														selectedPeriod.toLowerCase()
													),
												});
											}}>
											Search
										</Button>
										<Button
											onClick={() => {
												setBrand("");
												setStationName("");
												setClassification("");
												setStatisticalPeriod(new Date());
												setSelectedPeriod("daily");
												setShowChart(false);
												setSelectedStation(null);
												setChartData([]);
												setHasSearched(false);
												getPSHReport({
													page: 1,
													limit: 10,
													inverterBrand: "",
													stationName: "",
													classification: "",
													period: "daily",
													date: new Date().toISOString().slice(0, 10),
												});
												setCurrentPage(1);
											}}>
											Reset
										</Button>
										<Button
											type="default"
											onClick={() =>
												exportPSHReport({
													inverterBrand: brand,
													stationName,
													classification,
													period: selectedPeriod.toLowerCase(),
													date: formatDateByPeriod(
														statisticalPeriod,
														selectedPeriod.toLowerCase()
													),
												})
											}>
											Export
										</Button>
									</Col>
								</Row>
							</div>
						</div>
            <Row>
              {/* Table Column */}
						<Col
							xs={24}
							lg={showChart ? 12 : 24}
							>
							<>
								<Table
									columns={pshReportColumns}
									dataSource={pshReportData}
									pagination={{
										current: currentPage,
										pageSize: pageSize,
										total: pshReportMeta?.itemCount || 0,
										showQuickJumper: true,
										showSizeChanger: true,
										pageSizeOptions: ["10", "20", "50", "100"],
										showTotal: (total) =>
											`Total: ${pshReportMeta?.itemCount || 0}`,
									}}
									onChange={handleTableChange}
									scroll={{ x: "max-content" }}
									className="psh-report-table"
								/>
							</>
						</Col>
						{/* Chart Column - Only show when chart is active */}
						{showChart && chartData.length > 0 && (
							<Col xs={24} lg={12} className="white-background-panel">
								<>
									{!loading && (
										<ResponsiveContainer width="100%" height={400}>
											<LineChart
												data={chartData}
												style={{ backgroundColor: "white" }}>
												<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
												<XAxis
													dataKey="day"
													label={{
														value: "Day",
														position: "insideBottom",
														offset: -5,
													}}
													stroke="#666"
												/>
												<YAxis
													label={{
														value: "PSH",
														angle: -90,
														position: "insideLeft",
													}}
													stroke="#666"
												/>
												<Tooltip
													formatter={(value, name) => [value.toFixed(3), "PSH"]}
													labelFormatter={(label) => `Day ${label}`}
													contentStyle={{
														backgroundColor: "white",
														border: "1px solid #d9d9d9",
													}}
												/>
												<Line
													type="monotone"
													dataKey="psh"
													stroke="#1890ff"
													strokeWidth={2}
													dot={{ fill: "#1890ff", strokeWidth: 2, r: 4 }}
													activeDot={{ r: 6 }}
												/>
												<ReferenceLine
													y={3.2}
													stroke="red"
													strokeDasharray="5 5"
													label={{
														value: "Threshold (3.2)",
														position: "topRight",
													}}
												/>
											</LineChart>
										</ResponsiveContainer>
									)}
									{loading && (
										<div
											style={{
												height: 400,
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												flexDirection: "column",
												gap: 16,
											}}>
											<Spin size="large" />
											<div style={{ color: "#666", fontSize: 16 }}>
												Loading chart data...
											</div>
										</div>
									)}
								</>
							</Col>
						)}
            </Row>
					</div>
				</Col>
			</Row>
		</>
	);
}

export default TableContent;
