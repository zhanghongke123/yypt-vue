<template>
     <div :style="{'height':height,'padding':'10px'}">
         <vxe-grid 
            ref='xGrid' 
            v-bind="gridOptions"
            @toolbar-button-click="toolbarButtonClickEvent"
            @cell-dblclick="cellDblclick">

             <template v-for="(index, name) in $scopedSlots" v-slot:[name]="data">
                <slot :name="name" v-bind="data"/>
             </template>

         </vxe-grid>
         <vxe-modal 
            v-model="showForm"
            width="60%"
            height="60vh" 
            :title="formTitle"
            :esc-closable="false" 
            :destroy-on-close="true">
             <template #default>
                 <vxe-form 
                 ref="xForm" 
                 :data="formData"
                 :rules="formDataRules"
                 :items="formItems">
                     <template #btns>
                        <vxe-button  content="确定" status="primary" @click="formConfirm"></vxe-button>
                        <vxe-button  type="reset" status="danger" content="重置"></vxe-button>
                        <vxe-button  content="取消" @click="showForm = false"></vxe-button>
                     </template>
                 </vxe-form>
             </template>
         </vxe-modal>
     </div>
</template>

<script>
export default {
    name:"single-page",
    props:{
        pageConfig:Object
    },
    created(){
        this.handButtons()
        this.handDict()
    },
    data () {
        return {
            formTitle:"",
            showForm:false,
            isEdit:false,
            canEdit:false,
            editRow:{},
            formItems:this.pageConfig.formItems,
            dictInfo:{},
            columns: this.pageConfig.tableColumn,
            queryItems: this.pageConfig.queryItems,
            defaultFormData: {},
            formData: {},
            formDataRules: {},
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
                query: ({ page, sorts, filters, form }) => {
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
                    },
                delete: ({ body }) =>{
                    return this.$api.post(this.pageConfig.deleteUrl,body.removeRecords).then(resp => resp)
                }
                // save: ({ body }) => {
                //     return this.$api.post(this.pageConfig.saveUrl,body).then(resp => resp)
                // }
              }
            },
            toolbarConfig: {
                buttons: [],
                refresh: true
            }
        }
    },
    computed:{
        height(){
            return this.pageConfig.height
        },
        gridOptions () {
        return  {
                border: true,
                showHeaderOverflow: true,
                showOverflow: true,
                height: 'auto',
                stripe:true,
                rowConfig: {
                    isHover: true
                },
                sortConfig: {
                    trigger: 'cell',
                    remote: true
                },
                formConfig:{
                    titleWidth: 100,
                    titleAlign: "right",
                    items: this.queryItems
                },
                pagerConfig: this.pagerConfig,
                proxyConfig: this.proxyConfig,
                columns: this.columns,
                toolbarConfig: this.toolbarConfig
            }
        }
        
    },
    methods: {
        //处理字典
        
        async handDict(){
            let columns = []

            for (let i = 0; i < this.pageConfig.tableColumn.length; i++) {
                let item = this.pageConfig.tableColumn[i];
                let dictCode = item.dictCode
                if(dictCode){
                    if(!item.editRender){
                        item.editRender = {}
                    }
                    item.editRender.name = '$select'
                   if (!this.dictInfo[dictCode]){
                        let resp = await this.$api.get('/sysdict/codeInfo',{"dictCode":dictCode})
                        this.dictInfo[dictCode] = resp
                   }
                   item.editRender.options = this.dictInfo[dictCode]
                }
                item.resizable = true
                columns.push(item)
            }
            this.columns = columns
            
            //处理表单
            let formItems = []
            for (let i = 0; i < this.formItems.length; i++) {
                const item = this.formItems[i];
                this.defaultFormData[item.field] = null
                let dictCode = item.dictCode
                if(dictCode){
                    if(!item.itemRender){
                        item.itemRender = {}
                    }
                    item.itemRender.name = '$select'
                   if (!this.dictInfo[dictCode]){
                        let resp = await this.$api.get('/sysdict/codeInfo',{"dictCode":dictCode})
                        this.dictInfo[dictCode] = resp
                   }
                   item.itemRender.options = this.dictInfo[dictCode]
                }
                formItems.push(item)

                if(item.required){
                    this.formDataRules[item.field] = []
                    this.formDataRules[item.field].push({ required: true, message: item.title+'不能为空' })
                }
            }

            formItems.push({
                align: 'center',
                span: 24,
                slots: { default: 'btns' } 
            })
            this.formItems = formItems
            //处理默认数据
            this.formData = Object.assign({},this.defaultFormData)


             //处理查询
            let queryItems = []
            for (let i = 0; i < this.queryItems.length; i++) {
                const item = this.queryItems[i];
                let dictCode = item.dictCode
                if(dictCode){
                    if(!item.itemRender){
                        item.itemRender = {}
                    }
                    item.itemRender.name = '$select'
                   if (!this.dictInfo[dictCode]){
                        let resp = await this.$api.get('/sysdict/codeInfo',{"dictCode":dictCode})
                        this.dictInfo[dictCode] = resp
                   }
                   item.itemRender.options = this.dictInfo[dictCode]
                }
                queryItems.push(item)
            }
            this.queryItems = queryItems

        },
        handButtons(){
            let buttons = this.$route.meta.buttons
            if(buttons){
                for (let i = 0; i < buttons.length; i++) {
                    const button = buttons[i];
                    if(button.requestPath === 'edit'){
                        this.canEdit = true
                        continue
                    }
                    this.toolbarConfig.buttons.push({ code: button.requestPath, name: button.name, icon: '' },)
                }
            }
        },
        toolbarButtonClickEvent({ code }){
          const $grid = this.$refs.xGrid
          if("add" === code){
             this.isEdit = false
             this.formData = Object.assign({},this.defaultFormData)
             this.showForm = true
             if(this.$refs.xForm){
                this.$refs.xForm.clearValidate()
             }
             this.formTitle = '新增'
          }
          this.$emit("action",code,this.$refs.xGrid.getCheckboxRecords())
        },
        cellDblclick({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }){
            if(this.canEdit){
                if (column.type === 'checkbox') {
                    return
                }
                this.formData = Object.assign({},row)
                this.showForm = true
                    if(this.$refs.xForm){
                    this.$refs.xForm.clearValidate()
                    }
                this.isEdit = true
                this.editRow = row
                this.formTitle = '修改'
            }
        },
        formConfirm(){
            this.$refs.xForm.validate(valid => {
                if(!valid){ 
                    this.$api.post(this.pageConfig.saveUrl,this.formData).then(resp =>{
                        this.showForm = false
                        if(this.isEdit){
                            let keys = Object.keys(this.formData)
                            for (let i = 0; i < keys.length; i++) {
                                const key = keys[i];
                                this.editRow[key] = this.formData[key]
                            }
                        }else{
                            this.$refs.xGrid.createRow(Object.assign({},resp)).then(row => {
                                let data = this.$refs.xGrid.getData()
                                data.splice(0,0,row)
                                this.$refs.xGrid.loadData(data)
                            })
                            
                        }
                    })
                }
            })
        },
        clearSelect(){
            this.$refs.xGrid.clearCheckboxRow()
        }
    }

    
}
</script>

<style  scoped>

</style>