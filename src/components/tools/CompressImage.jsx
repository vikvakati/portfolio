import { useState, useEffect, useRef } from "react";
import imageCompression from "browser-image-compression";

const CompressImage = () => {
	const [originalFile, setOriginalFile] = useState(null);
	const [compressedFile, setCompressedFile] = useState(null);
	const [previewUrl, setPreviewUrl] = useState(null);
	const [quality, setQuality] = useState(0.8);
	const fileInputRef = useRef(null);

	useEffect(() => {
		if (!originalFile) return;
		let url;

		const compress = async () => {
			try {
				const options = {
					maxSizeMB: 2,
					maxWidthOrHeight: 2048,
					useWebWorker: true,
					initialQuality: quality,
				};
				const compressed = await imageCompression(originalFile, options);
				setCompressedFile(compressed);

				if (url) URL.revokeObjectURL(url);
				url = URL.createObjectURL(compressed);
				setPreviewUrl(url);
			} catch (err) {
				console.error("Compression error:", err);
			}
		};

		compress();

		return () => {
			if (url) URL.revokeObjectURL(url);
		};
	}, [originalFile, quality]);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		setOriginalFile(file);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.dataTransfer.files?.[0]) {
			setOriginalFile(e.dataTransfer.files[0]);
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const downloadCompressed = () => {
		if (!compressedFile) return;
		const url = URL.createObjectURL(compressedFile);
		const link = document.createElement("a");
		link.href = url;
		link.download = `compressed_${originalFile.name}`;
		link.click();
		URL.revokeObjectURL(url);
	};

	return (
		<div className="flex flex-col items-center mt-2 w-full max-w-5xl">
			<div className="flex flex-col md:flex-row gap-7 w-full min-h-[500px]">
				<div className="flex flex-1 flex-col items-center justify-center">
					{previewUrl ? (
						<div className="relative w-full rounded-2xl overflow-hidden flex items-center justify-center bg-gray-900">
							<img
								src={previewUrl}
								alt="Compressed Preview"
								className="max-h-[550px] w-auto object-contain rounded-lg"
							/>
							<input
								type="file"
								accept="image/*"
								ref={fileInputRef}
								onChange={handleFileChange}
								onDrop={handleDrop}
								onDragOver={handleDragOver}
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
							/>
						</div>
					) : (
						<div
							className="relative w-full h-[300px] rounded-2xl border-2 border-dashed border-gray-600 bg-gray-800/50 flex items-center justify-center cursor-pointer"
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							onClick={() => fileInputRef.current.click()}
						>
							<p className="text-secondary text-center">
								Drag & drop an image here, or click to select
								<br />
								(JPG, PNG, GIF)
							</p>
							<input
								type="file"
								accept="image/*"
								ref={fileInputRef}
								onChange={handleFileChange}
								className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
							/>
						</div>
					)}

					{/* Slider */}
					{originalFile && (
						<div className="flex flex-col items-center w-full mt-3">
							<span className="text-white text-sm mb-1">
								Quality: {(quality * 100).toFixed(0)}%
							</span>
							<input
								type="range"
								min="0.1"
								max="1"
								step="0.01"
								value={quality}
								onChange={(e) => setQuality(parseFloat(e.target.value))}
								className="w-full"
							/>
						</div>
					)}
				</div>

				{compressedFile && (
					<div className="flex flex-col items-center justify-center w-full md:w-[220px] text-white text-sm">
						<div className="space-y-1 mb-6 text-center">
							<p>Original: {(originalFile.size / 1024).toFixed(2)} KB</p>
							<p>Compressed: {(compressedFile.size / 1024).toFixed(2)} KB</p>
						</div>
						<button
							onClick={downloadCompressed}
							className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-600 transition font-medium"
						>
							Download
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default CompressImage;
