import { ChangeEvent, useState } from 'react';
import axios, {AxiosResponse} from 'axios';
import {useAuthHeader} from 'react-auth-kit';
import Navbar from './Navbar';

const Private = ({images}: any) => {
    const [file, setFile] = useState<File>();
    const [image, setImage] = useState();
    const authHeader = useAuthHeader();
    const token: string = authHeader();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (!file) {
            return;
        }

        axios.post('/api/gateway/upload/', {image: file}, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': token
            }
        })
            .then((res: AxiosResponse) => alert("Image uploaded successfully"))
            .catch((err) => console.error(err));

    }

    // TODO: check if can be better resolved
    // const handleDownload = () => {
    //     axios.get('http://gateway/api/gateway/download?fid=63c7cf09e92fad9527338043', {
    //         headers: {
    //             'Authorization': token,
    //             responseType: 'blob'
    //         }
    //     })
    //     .then((res) => {
    //         setImage(res.data)
    //     })
    // }

    return (
        <>
        <Navbar images={images}/>
            <div className="flex flex-col justify-center items-center w-full h-auto">
                <label className="block text-sm font-medium text-gray-700">Upload RGB Image</label>
                <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 w-1/2">
                    {!file ?
                        <div className="space-y-1 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                            >
                                <path
                                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <div className="flex text-sm text-gray-600">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 8MB</p>
                        </div>
                        :
                        <div>{file && `${file.name} - ${file.type}`}</div>
                    }
                </div>
                <div className="flex justify-center items-center mt-2">
                    <button onClick={handleUploadClick} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">Upload</button>
                </div>
            </div>
        </>
    );
};

export default Private;