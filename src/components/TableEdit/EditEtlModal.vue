<template>
  <div class="edit-popup-modal">
    <vxe-input class="edit-popup-input" v-model="row[column]" placeholder="请选择" disabled></vxe-input>
    <vxe-button class="edit-popup-button" icon="vxe-icon--search" type="text" status="primary" @click="popupEvent"></vxe-button>
    <vxe-button class="edit-popup-button" icon="vxe-icon--close" type="text" status="danger" @click="clear"></vxe-button>
    <vxe-modal
      show-footer
      :title="title"
      :esc-closable ="false"
      class-name="vxe-table--ignore-clear edit-popup-box"
      width="50%"
      height="50vh"
      v-model="modalVisible"
      @confirm="confirmEvent">
      <template #default>
          <vxe-grid ref='xGrid' v-bind="gridOptions"></vxe-grid>
      </template>
    </vxe-modal>
  </div>
</template>

<script>
export default {
  name: 'EditEtlModal',
  props: {
    params: Object,
    pageConfig: Object
  },
  data () {
    return {
      row: null,
      column: null,
      modalVisible: false,
      loading: false,
      pagerConfig: {
        border: true,
        layouts: ['Sizes','PrevJump', 'PrevPage', 'Number',  'NextPage', 'NextJump','Jump','PageCount', 'Total'],
        pageSize: 50,
        pageSizes: [50, 100, 200, 500, 1000],
        align: 'left'
      },
      proxyConfig: {
        seq: true,
        sort: true,
        filter: true,
        form: true,
        props: {
          result: 'records',
          total: 'total'
        },
        ajax: {
          query: ({ page, sorts, filters, form }) =>{
             const queryParams = Object.assign({}, form)
             filters.forEach(({ property, values }) => {
                queryParams[property] = values.join(',')
             })
             let param = {
                pageNum: page.currentPage,
                pageSize: page.pageSize,
                querylist: queryParams
             }

             // 处理排序条件
            const firstSort = sorts[0]
            if (firstSort) {
              param.sortField = firstSort.property
              param.sortOrder = firstSort.order
            } 
            return this.$api.post(this.pageConfig.queryUrl,param).then(resp => resp);
          }
        }

      }
    }
  },
  created () {
    this.load()
  },
  computed: {
    title () {
       return this.pageConfig.title
    },
    gridOptions () {
       return  {
            border: true,
            showHeaderOverflow: true,
            showOverflow: true,
            height: 'auto',
            stripe: true,
            rowConfig: {
                isHover: true
            },
            sortConfig: {
                trigger: 'cell',
                remote: true
            },
            checkboxConfig: {
                highlight: true
            },
            keyboardConfig: {
                isChecked: true
            },
            pagerConfig: this.pagerConfig,
            formConfig: this.pageConfig.queryFormConfig,
            proxyConfig: this.proxyConfig,
            columns: this.pageConfig.tableColumn
       }
       
    },
    resultMap () {
       return this.pageConfig.resultMap
    }
  },
  methods: {
    load () {
      const { data, property } = this.params
      this.row = data
      this.column = property

      if( this.$refs.xGrid ) {
        this.$refs.xGrid.setAllCheckboxRow(false)
      }
    },
    popupEvent () {
      this.modalVisible = true
    },
    confirmEvent () {
      const { row, column } = this
      const selectRecords = this.$refs.xGrid.getCheckboxRecords()
      let keys = Object.keys(this.resultMap)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        row[this.resultMap[key]] = selectRecords[0][key]
      }
    },
    clear () {
      const { row, column } = this
      let keys = Object.keys(this.resultMap)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        row[this.resultMap[key]] = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-popup-modal {
  display: flex;
  align-items: center;
}
.edit-popup-input {
  width: auto;
  flex-grow: 1;
}
.edit-popup-button {
  flex-shrink: 0;
}

/deep/ .vxe-select {
  width: 100px;
  .vxe-input{
    width: 100px;
  }
}

/deep/ .vxe-pager--sizes{
    width: 100px;
    text-align: left;
    display: inline;
}


/deep/ .vxe-select-option--wrapper{
  width: 100px;
}

/deep/ .is--disabled{
  .vxe-input--inner{
    color: black;
    background-color: #f3f3f3;
  }
}



</style>