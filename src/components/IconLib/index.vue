<template>
  <div class="container">
        <div v-for="item of svgIcons" :key="item" @click="select(item)">
          <el-tooltip placement="top">
            <div slot="content" >
              点击选择
            </div>
            <div class="icon-item">
              <svg-icon :icon-class="item" class-name="disabled" />
              <span>{{ item }}</span>
            </div>
          </el-tooltip>
        </div>
  </div>
</template>

<script>
import svgIcons from './svg-icons'

  export default {
    name:'IconLib',
    props:[''],
    data () {
      return {
         svgIcons:svgIcons
      };
    },

    methods: {
        select(icon){
            this.$message({
                message: `选择 ${icon} 成功`,
                type: 'success'
                });
            this.$emit('getIcon',icon)

        }
    },

  }

</script>
<style lang='scss' scoped>
.container{
    overflow: hidden;
}

.icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 10px;
    color: #24292e;
    cursor: pointer;
}

span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
}

.disabled {
    pointer-events: none;
}

.svg-icon{
 width: 20px;
 height: 20px;
}

</style>