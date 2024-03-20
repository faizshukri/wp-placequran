import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	InspectorControls,
	AlignmentToolbar,
	BlockControls,
} from "@wordpress/block-editor";
import {
	PanelBody,
	ComboboxControl,
	TextControl,
	FormTokenField,
	SelectControl,
	ToolbarGroup,
} from "@wordpress/components";
import { useDebounce } from "@wordpress/compose";

import { useState, useEffect } from "react";
import { Sura } from "./quran-data";
import "./edit.scss";

export default function Edit({ attributes, setAttributes }) {
	const { url, surah, verse, translation, size, alignment } = attributes;
	const [invalidVerse, setInvalidVerse] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(
		useDebounce(() => triggerChange(), 1000),
		[verse],
	);

	useEffect(() => {
		triggerChange();
	}, [surah, translation, size]);

	const options = Sura.slice(1, 115).map((s, index) => ({
		value: index + 1,
		label: `${index + 1} ${s[5]} (${s[1]})`,
	}));

	const translationOptions = [
		{
			value: "en",
			label: "English",
		},
		{
			value: "ms",
			label: "Malay",
		},
		{
			value: "id",
			label: "Indonesia",
		},
		{
			value: "tr",
			label: "Turkish",
		},
		{
			value: "ur",
			label: "Urdu",
		},
		{
			value: "hi",
			label: "Hindi",
		},
	];

	const validatedVerse = (verses) => {
		try {
			if (/[^\d,-\s]/.test(verses) || /(^|[,-])\s*([,-]|$)/.test(verses)) {
				throw new Error("Invalid verses");
			}

			const res = verses
				.replace(" ", "")
				.split(",")
				.flatMap((num) => {
					if (num.includes("-")) {
						const [from, to] = num.split("-").map((num) => parseInt(num));
						if (from > to) {
							throw new Error("Invalid verses");
						}

						return Array(to - from + 1)
							.fill(0)
							.map((_, idx) => from + idx);
					}

					return parseInt(num);
				});

			return res;
		} catch {
			setInvalidVerse(true);
			return false;
		}
	};

	const triggerChange = () => {
		if (!surah || !verse) {
			return;
		}

		if (validatedVerse(verse)) {
			const newUrl = `https://placequran.com/${
				size !== "auto" ? size + "/" : ""
			}${surah}/${verse}/ar${
				translation.length == 0 ? "" : "," + translation.join(",")
			}`;

			if (newUrl !== url) {
				setLoading(true);
				setAttributes({
					url: newUrl,
				});
			}
			setInvalidVerse(false);
		}
	};

	const onImageLoad = () => {
		setLoading(false);
	};

	return (
		<p {...useBlockProps()} style={{ textAlign: alignment }}>
			<InspectorControls>
				<PanelBody title="Settings">
					<ComboboxControl
						label="Surah"
						value={surah}
						onChange={(x) => setAttributes({ surah: x })}
						options={options}
					/>
					<TextControl
						help="Range and/or comma separated. eg: 1-5,7"
						label={`Verses ${invalidVerse ? "- Invalid" : ""}`}
						value={verse}
						onChange={(x) => setAttributes({ verse: x })}
						className={invalidVerse ? "invalid" : ""}
					/>
					<FormTokenField
						__experimentalAutoSelectFirstMatch
						__experimentalExpandOnFocus
						label="Translations (max: 2)"
						onChange={(translations) =>
							setAttributes({
								translation: translations.map(
									(x) => translationOptions.find((y) => y.label == x).value,
								),
							})
						}
						suggestions={translationOptions.map(({ label }) => label)}
						value={translation.map(
							(x) => translationOptions.find((y) => y.value == x).label,
						)}
					/>
					<SelectControl
						label="Size"
						help="Adaptive will adjust the size according to the viewing device."
						value={size}
						onChange={(x) => setAttributes({ size: x })}
						options={[
							{
								disabled: true,
								label: "Select a size",
								value: "",
							},
							{
								label: "Adaptive (auto)",
								value: "auto",
							},
							{
								label: "Small",
								value: "s",
							},
							{
								label: "Medium",
								value: "m",
							},
							{
								label: "Large",
								value: "l",
							},
						]}
					/>
				</PanelBody>
			</InspectorControls>
			<BlockControls>
				<ToolbarGroup>
					<AlignmentToolbar
						value={alignment}
						onChange={(x) => setAttributes({ alignment: x })}
					/>
				</ToolbarGroup>
			</BlockControls>
			{url ? (
				<img src={url} onLoad={onImageLoad} />
			) : (
				<div
					style={{
						border: "2px dashed #b9b9b9",
						borderRadius: "7px",
						backgroundColor: "#ededed",
						height: "80px",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						color: "#666666",
					}}
				>
					Select surah and verse from the sidebar
				</div>
			)}

			{loading && (
				<span
					style={{
						backgroundColor: "black",
						opacity: 0.6,
						position: "absolute",
						width: "100%",
						height: "100%",
						top: 0,
						left: 0,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<i className="loader"></i>
				</span>
			)}
		</p>
	);
}
