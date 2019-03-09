import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {upsetArr} from 'common/js/util'

export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playlist'
        ])
    },
    mounted(){
        this.handlePlaylist(this.playlist)
    },
    activated(){
        this.handlePlaylist(this.playlist)
    },
    methods: {
        handlePlaylist(){
            throw new Error('component must implement handlePlaylist method')
        }
    },
    watch: {
        playlist(newVal){
            this.handlePlaylist(this.playlist)
        }
    }
}

export const playerMixin = {
    computed: {
        iconMode() {
            return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
        },
        ...mapGetters([
            'playlist',
            'sequenceList',
            'currentSong',
            'mode',
            'favoriteList'
        ])
    },
    methods:{
        //修改播放模式
        changeMode(){
            const mode = (this.mode + 1) % 3;
            this.setPlayMode(mode);
            let list = [];
            if(mode === playMode.random){
                list = upsetArr(this.sequenceList); 
                this.resetCurIndex(list);
            }else{
                list = this.sequenceList;
                this.resetCurIndex(list);
            }
            this.setPlayList(list);
        },
        //重置当前歌曲在播放列表的索引
        resetCurIndex(list){
            let index = list.findIndex((item)=>{
                return item.id === this.currentSong.id;
            })
            this.setCurrentIndex(index);
        },
        favoriteIcon(song){
            if(this.isFavorite(song)){
                return 'icon-favorite'
            }else{
                return 'icon-not-favorite'
            }
        },
        toggleFavorite(song){
            if(this.isFavorite(song)){
                this.deleteFavoriteList(song)
            }else{
                this.saveFavoriteList(song)
            }
        },
        isFavorite(song){
            let index = this.favoriteList.findIndex((item)=>{
                return item.id === song.id
            })
            return index !== -1
        },
        ...mapMutations({
            setPlayingState: 'SET_PLAYING_STATE',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAYLIST'
        }),
        ...mapActions([
            'saveFavoriteList',
            'deleteFavoriteList'
        ])
    }
}

export const searchMixin = {
    computed:{
        ...mapGetters([
            'searchHistory'
        ])
    },
    data(){
        return{
            query: '',
            refreshDelay: 100
        }
    },
    methods:{
        onQueryChange(query){
            this.query = query;
        },
        blurInput(){
            this.$refs.searchBox.blur();
        },
        saveSearch(){
            this.saveSearchHistory(this.query);
        },
        addQuery(query){
            this.$refs.searchBox.setQuery(query);
        },
        deleteHistory(history){
            this.deleteSearchHistory(history)
        },
        ...mapActions([
            'saveSearchHistory',
            'deleteSearchHistory',
        ])
    }
   
}