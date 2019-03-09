import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {upsetArr} from 'common/js/util'
import {saveSearch,deleteOneSearchHistory,clearSearchHistory,savePlay,saveFavorite,deleteOneFavorite} from 'common/js/cache'



function _findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}


export const selectPlay = function ({commit,state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  if(state.mode === playMode.random){
    let randomList = upsetArr(list);
    commit(types.SET_PLAYLIST, randomList);
    index = _findIndex(randomList,list[index]);
  }else{
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function ({commit}, list) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let randomList = upsetArr(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;

  //当前播放的歌曲
  let currentSong = playlist[currentIndex];

  //查找当前列表有没有待插入歌曲，有则返回索引
  let findPLIndex = _findIndex(playlist, song);

  //插入歌曲
  currentIndex++;
  playlist.splice(currentIndex, 0, song);

  //已经有这首歌
  if(findPLIndex !== -1){
    if(currentIndex > findPLIndex){
      playlist.splice(findPLIndex, 1);
      currentIndex--;
    }else{
      playlist.splice(findPLIndex + 1, 1);
    }
  }

  let findCurSongIndex = _findIndex(sequenceList, currentSong) + 1;

  let findSLIndex = _findIndex(sequenceList, song);

  sequenceList.splice(findCurSongIndex, 0, song);

  if(findSLIndex !== -1){
    if(findCurSongIndex > findSLIndex){
      sequenceList.splice(findSLIndex, 1);
    }else{
      sequenceList.splice(findSLIndex + 1, 1);
    }
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function({commit}, query){
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({commit},query){
  commit(types.SET_SEARCH_HISTORY, deleteOneSearchHistory(query))
}

export const clearAllSearchHistory = function({commit}){
  commit(types.SET_SEARCH_HISTORY, clearSearchHistory())
}

export const deleteSong = function ({commit, state}, song){
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;

  let findPLIndex = _findIndex(playlist, song);
  playlist.splice(findPLIndex, 1);
  
  let findSLIndex = _findIndex(sequenceList, song);
  sequenceList.splice(findSLIndex, 1);

  if(currentIndex > findPLIndex || currentIndex === playlist.length){
    currentIndex--;
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  let playingState = playlist.length > 0;
  commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteSongList = function ({commit}) {
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING_STATE, false)
}

export const savePlayHistory = function({commit},song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const saveFavoriteList = function({commit},song){
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function({commit},song){
  commit(types.SET_FAVORITE_LIST, deleteOneFavorite(song))
}