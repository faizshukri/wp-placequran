/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from "@wordpress/i18n";

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import {
	PanelBody,
	ComboboxControl,
	TextControl,
	FormTokenField,
	Button,
} from "@wordpress/components";

import { useState, useEffect } from "react";

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import "./editor.scss";

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */

export default function Edit({ attributes, setAttributes }) {
	const { url } = attributes;
	const [surah, setSurah] = useState("");
	const [verse, setVerse] = useState("");
	const [translation, setTranslation] = useState([]);

	useEffect(() => {
		triggerChange();
	}, [surah, verse, translation]);

	const options = [
		{
			value: "1",
			label: "1. Al Fatihah",
		},
		{
			value: "2",
			label: "2. Al Baqarah",
		},
		{
			value: "3",
			label: "3. Ali Imran",
		},
	];

	const translationOptions = [
		{
			value: "en",
			label: "English",
		},
		{
			value: "ms",
			label: "Malay",
		},
	];

	const validateVerse = (verses) => {
		if (/[^\d,-\s]/.test(verses) || /(^|[,-])\s*([,-]|$)/.test(verses)) {
			return false;
		}

		return true;
	};

	const triggerChange = () => {
		if (!surah || !verse) {
			return;
		}

		if (validateVerse(verse)) {
			const newUrl = `https://placequran.com/${surah}/${verse}/ar${
				translation.length == 0 ? "" : "," + translation.join(",")
			}`;
			setAttributes({
				url: newUrl,
			});
		}
	};

	return (
		<div {...useBlockProps()}>
			<InspectorControls>
				<PanelBody title="Settings">
					<ComboboxControl
						label="Surah"
						value={surah}
						onChange={(x) => {
							setSurah(x);
						}}
						options={options}
					/>
					<TextControl
						help="Range and/or comma separated. eg: 1-5,7"
						label="Verses"
						value={verse}
						onChange={(x) => {
							setVerse(x);
						}}
					/>
					<FormTokenField
						__experimentalAutoSelectFirstMatch
						__experimentalExpandOnFocus
						label="Translations"
						onChange={(translations) => {
							setTranslation(
								translations.map(
									(x) => translationOptions.find((y) => y.label == x).value,
								),
							);
						}}
						suggestions={translationOptions.map(({ label }) => label)}
						value={translation.map(
							(x) => translationOptions.find((y) => y.value == x).label,
						)}
					/>
				</PanelBody>
			</InspectorControls>
			<img src={url} />
		</div>
	);
}
