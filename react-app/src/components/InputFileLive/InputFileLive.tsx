/* eslint-disable */
import React from 'react';
import './InputFileLive.css';

interface IProps {
	inputValues: any;
	setInputValues: any;
	inputValueFile: any;
	onChangeHandle: any;
	inputNameFile: string;
	customClass?: string;
	maxSize?: number;
	fileTypes?: string[];
}

const InputFileLive = ({
	customClass,
	inputValues,
	setInputValues,
	inputNameFile,
	onChangeHandle,
	inputValueFile,
	maxSize = 5000,
	fileTypes = ['pdf'],
}: IProps) => {
	const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement> | any) => {
		let totalSizeFile = 0;
		const totalFiles: number = e.target.files.length;

		let canUploadExtension = true;

		for (let i = 0; i < totalFiles; i += 1) {
			const nameFile = e.target.files[i].name;
			const lastDot = nameFile.lastIndexOf('.');
			const ext = nameFile.substring(lastDot + 1);
			totalSizeFile += parseInt(e.target.files[i].size, 10);

			if (!fileTypes.includes(ext)) {
				canUploadExtension = false;
			}
		}
		// eslint-disable-next-line
		totalSizeFile /= 1000;
		if (totalSizeFile > maxSize) {
			e.target.value = null;

			setInputValues(
				inputValues.map((field: any) => {
					if (field.name === e.target.name) {
						return {
							...field,
							value: '',
							error: 'Max size',
							files: [],
						};
					}
					return { ...field };
				}),
			);
		} else if (!canUploadExtension) {
			e.target.value = null;
			setInputValues(
				inputValues.map((field: any) => {
					if (field.name === e.target.name) {
						return {
							...field,
							value: '',
							error: 'Ops, extension not allowed',
							files: [],
						};
					}
					return { ...field };
				}),
			);
		} else if (totalSizeFile <= maxSize && canUploadExtension) {
			setInputValues(
				inputValues.map((field: any) => {
					if (field.name === e.target.name) {
						return {
							...field,
							value: e.target.value,
							error: '',
							files: e.target.files,
						};
					}
					return { ...field };
				}),
			);
		}
	};

	const handleDeleteFile = (e: any) => {
		e.preventDefault();
		e.target.value = null;

		setInputValues(
			inputValues.map((field: any) => {
				if (field.name === inputNameFile) {
					return {
						...field,
						value: '',
						error: '',
						files: [],
					};
				}
				return { ...field };
			}),
		);
	};

	return (
		<>
			<div className={`input-file-live__wraper ${customClass && customClass}`}>
				<div
					className={`input-file-live__full ${
						inputValueFile.length > 0 ? 'input-file-live--empty' : 'input-file-live--full'
					}`}
				>
					<button type="button" onClick={handleDeleteFile}>
						Excluir arquivos
					</button>
					<p className="input-file-live__label">Arquivo carregado</p>
				</div>

				<input
					type="file"
					name={inputNameFile}
					value={inputValueFile}
					onChange={handleChangeFile}
				/>
				<div
					className={`input-file-live ${
						inputValueFile.length > 0 ? 'input-file-live--full' : 'input-file-live--empty'
					}`}
				>
					<p className="input-file-live__label">Carregue seu arquivo</p>
				</div>
			</div>
		</>
	);
};

export default InputFileLive;
