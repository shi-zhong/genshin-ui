import ScrollView from '@@/Base/ScrollView'
import { EventDispatch, ClassNameWithCSSModuleFactor } from '@/utils'

import {
  onMounted,
  defineComponent,
  reactive,
  ref,
  provide,
  inject,
  type Ref,
  watch,
  type App
} from 'vue'

import Style from './index.module.less'

const S = ClassNameWithCSSModuleFactor(Style, 'tabs-')

const TabsSymbol = Symbol()

interface TabPaneProps {
  tabKey: string
  title?: string
}

/**
 * Tab 使用一个symbol作为键名，向下方的 TabPane 组件传递当前的激活键和一个键的收集函数
 *
 * TabPane在挂载时向Tab注册键名用以创建视图，使用传递的activeKey来处理自身的视图
 *
 * 可以成为外部受控组件
 */

const TabPane = defineComponent<TabPaneProps>(
  (props, { slots }) => {
    const fromTabs = inject<{
      tab: Ref<string>
      TabPaneCollect: (s: TabPaneProps) => void
    }>(TabsSymbol)

    onMounted(() => {
      fromTabs?.TabPaneCollect(props)
    })

    return () => <>{props.tabKey === fromTabs?.tab.value && slots.default ? slots.default() : ''}</>
  },
  {
    name: 'GTabPane',
    props: ['tabKey', 'title']
  }
)

// @ts-ignore
TabPane.install = (app: App) => app.component(TabPane.name, TabPane)

const Tabs = defineComponent<
  { default?: string; disable?: string[]; active?: string },
  {
    click: (tab: string) => void
    // 点击不同项时触发
    change: (tab: string) => void
  }
>(
  (props, { emit, slots }) => {
    const tab = ref(props.default || '')
    const Keys = reactive<TabPaneProps[]>([])

    const TabPaneCollect = (key: TabPaneProps) => {
      if (Keys.findIndex((tp) => tp.tabKey === key.tabKey) === -1) {
        Keys.push(key)
      }

      // default 不存在 并且 tab 未被设置时，默认选取第一个作为选中值
      if (props.default === undefined && Keys.findIndex((tp) => tp.tabKey === tab.value) === -1) {
        tab.value = key.tabKey
      }
    }

    watch(
      () => props.active,
      () => {
        if (props.active !== undefined) {
          tab.value = props.active
        }
      }
    )

    provide(TabsSymbol, {
      tab,
      TabPaneCollect
    })

    const handleTabs = (e: Event) => {
      EventDispatch<{ key: string }>(e, {
        tab: (dataset) => {
          if ((props.disable ?? []).includes(dataset.key)) return
          if (dataset.key !== tab.value) {
            emit('change', dataset.key)
          }
          emit('click', dataset.key)
          tab.value = dataset.key
        }
      })
    }

    return () => (
      <div>
        <div class={S('nav')} data-type="tabs" onClick={handleTabs}>
          {Keys.map((k: TabPaneProps) => (
            <button
              key={k.tabKey}
              data-type="tab"
              data-key={k.tabKey}
              class={S({
                active: tab.value === k.tabKey,
                'not-active': tab.value !== k.tabKey,
                disable: (props.disable ?? []).includes(k.tabKey)
              })}
              style={`min-width: ${100 / Keys.length}%;`}
            >
              {k.title ?? k.tabKey}
            </button>
          ))}
        </div>
        <ScrollView class={S('item')} customScrollbar="custom" scrollBehavior="auto" slide>
          {slots.default && slots.default()}
        </ScrollView>
      </div>
    )
  },
  {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'GTabs',
    props: ['default', 'disable', 'active']
  }
)

// @ts-ignore
Tabs.install = (app: App) => app.component(Tabs.name, Tabs)

export type { TabPaneProps }
export { TabPane, Tabs }
