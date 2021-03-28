const path = require('path')
const cprocess = require("child_process");
const express = require('express')
express()
const {
  app,
  BrowserWindow,
  Tray,
  ipcMain,
  globalShortcut
} = require('electron')


ipcMain.on("min-win",function () {
  mainWindow.minimize();
});
ipcMain.on("full-win",function () {
  mainWindow.maximize();
});
ipcMain.on("res-win",function () {
  mainWindow.unmaximize();
});
ipcMain.on("openDevTools",function () {
  mainWindow.webContents.openDevTools();
});
let mainWindow = null



function initialize (url) {
  function createWindow () {
    const { screen } = require('electron')
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    const windowOptions = {
      minWidth: 680,
      width: width, height: height,
      x: 0,
      y: 0,
      title: "hellow world!",
      frame: false,
      titleBarStyle: 'customButtonsOnHover',
      alwaysOnTop: false,
      focus: true,
      webPreferences: {
        nodeIntegration: true
      },
      transparent: true,
    };


    mainWindow = new BrowserWindow(windowOptions);
    // mainWindow.webContents.openDevTools();
    // const child = new BrowserWindow({parent: mainWindow, modal: true, show: false})
    // child.show();
    // child.loadURL(`file://${__dirname}/index.html`);
    mainWindow.show();

    // mainWindow.loadURL(`http://localhost:8889`);
    console.log(url)
    mainWindow.loadURL(url);
    // mainWindow.loadURL(`http://localhost:9898`);
    mainWindow.on('closed', () => {
      mainWindow = null
    })
    let curwin = mainWindow;
    console.log(curwin.next)
  }

  app.on('ready', () => {
    createWindow()
  })

  app.on('window-all-closed', () => {
      app.quit()
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

initialize(`http://localhost:8989`);
require('./proxy/cloud_music/app.js');
