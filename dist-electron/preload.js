"use strict";const{contextBridge:r,ipcRenderer:t}=require("electron");r.exposeInMainWorld("api",{storeSet:(e,o)=>t.invoke("store:set",e,o),storeGet:e=>t.invoke("store:get",e),storeDelete:e=>t.invoke("store:delete",e)});
