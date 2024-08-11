<template>
  <el-dialog v-model="visible">
    <div>
      <div class="flex-row" style="padding: 20px 0;">
        <div class="flex-item">
          <el-input v-model="keyword"></el-input>
        </div>
        <div style="padding-left: 20px">
          <el-button @click="search">搜索</el-button>
        </div>
      </div>
      <div id="tx_map"></div>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleChange">确定</el-button>
      <el-button @click="visible=false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {ref, defineExpose, nextTick, defineEmits} from 'vue';
import { ElMessage } from 'element-plus';
const mapKey = import.meta.env.VITE_TX_MAP_KEY;
const visible = ref<boolean>(false);
const keyword = ref<string>('');
let map:any = null;

const emit = defineEmits<{
  (e: 'change', value: Coord): void
}>();

const coord: Coord = {
  lat: "",
  lng: ""
};

const show = () => {
  visible.value = true;
  if(map === null) {
    nextTick().then(() => {
      try {
        if(undefined === TMap) {
          loadScript();
        } else {
          initMap();
        }
      } catch (e) {
        loadScript();
      }

    })
  }
}

function initMap() {
  map = new TMap.Map("tx_map", {
    pitch: 45,
    zoom: 14,
    center: new TMap.LatLng(39.984104, 116.307503)
  });

  let marker = new TMap.MultiMarker({
    id: 'marker-layer',
    map: map
  });

  //创建marker事件
  function createMarker(e: any) {
      marker.remove(['marker']);
      marker.add({
        id: 'marker',
        position: e.latLng
      });
  }

  map.on("click",function(e: any){
    createMarker(e);
    coord.lng = e.latLng.getLng().toFixed(6);
    coord.lat = e.latLng.getLat().toFixed(6);
  })
}

function setCenter(res: any) {
  map.setCenter(new TMap.LatLng(res.location.lat, res.location.lng));
}

function loadScript() {
  //创建script标签，并设置src属性添加到body中
  var script = document.createElement("script");
  script.onload = initMap;
  script.type = "text/javascript";
  script.src = `https://map.qq.com/api/gljs?v=1.exp&key=${mapKey}&callback=initMap`;
  document.body.appendChild(script);
}

function search() {
  if(!keyword.value) {
    ElMessage.error('请填写地址');
    return false;
  }
  fetch(`/ws/geocoder/v1/?address=${keyword.value}&key=${mapKey}`).then(res => {
    return res.json()
  }).then(res => {
    setCenter(res.result)
  })
}

const handleChange = () => {
  emit('change', coord);
  visible.value = false;
}

defineExpose({
  show
});
</script>

<style scoped>

</style>
