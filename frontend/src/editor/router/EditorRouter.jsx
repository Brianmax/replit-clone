import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Navbar } from '../../ui/components/NavBar'
import { ScriptsList } from '../../scripts'
import { PlayGround } from '../pages/PlayGround'

const getScriptById = async (scriptId) => {
	const { data } = await axios.get(`http://localhost:3000/script/${scriptId}`);
	console.log("[GET]", data)
	return data;
};

export const EditorRouter = () => {
  return (
    <>
        <Navbar/>
        <div>
          <Routes>
            <Route path="" element={<ScriptsList/>} />
            <Route path="editor/:scriptId" element={<PlayGround  />}/>
          </Routes>
        </div>
    </>
  )
}
