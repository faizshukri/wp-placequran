import { useBlockProps } from "@wordpress/block-editor";

export default function save({ attributes }) {
	const { url, alignment } = attributes;

	return (
		<p {...useBlockProps.save()} style={{ textAlign: alignment }}>
			<img src={url} />
		</p>
	);
}
