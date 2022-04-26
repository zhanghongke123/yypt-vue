<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon} class="item-icon"/>)
    }

    if (title) {
      vnodes.push(<span slot='title' class="title">{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style lang="scss" scoped>
.item-icon{
  font-size: 20px;
  vertical-align: -0.15em;
}

.title{
}

</style>
