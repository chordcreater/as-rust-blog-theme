
function expandCategoryTree (tree) {
  for (var i = 0; i < tree.length ; i++) {  
    // console.log(tree [i])
    var $li = $(tree [i])
    // 获取a元素
    var $category =$li.children().eq(0)
    var cur_href = $category.attr('href')
    var is_href = false
    const { href, pathname } = location
    // console.log('href, pathname, cur_href:',href ,cur_href)
    if (pathname === cur_href) {
      // 当前连接为该分类，若存在ul，这展开该ul
      // console.log('找到连接:href, pathname, cur_href:',href,pathname ,cur_href)
      is_href = true
    }
    // 是否存在ul
    var $ulElements = $li.children('ul')
    // console.log('$ulElements:',$ulElements)
    if(is_href) {
      if($ulElements.length > 0) {
        // 分类找到且存在子菜单则展开
        console.log('cur_href,cur----ulElements:',cur_href,$ulElements)
        $category.addClass('arrow-dropdown')
        $ulElements.addClass('expand')
      }
      console.log('cur_href,cur----category:',cur_href,$category)
      // 选择当前分类
      $category.addClass('current')
      return true
    }else if($ulElements.length > 0) {
      // 分类未找到且存在ul则继续递归找
      if(expandCategoryTree($ulElements.children())) {
        $ulElements.addClass('expand')
        $category.addClass('arrow-dropdown')
        console.log('未找到分类：cur_href,cur----$category:',cur_href,$category)
        return true
      }
    }
  }
  return false
}

const commonContext = {
  // testaaa() {
  //   console.log('Hello, this is a debug log!')
  // },
  /* 激活图片预览功能 */
  initGallery() {
    // 用链接和标题包装图像
    $('.main-content img:not(.not-gallery)').each(function () {
      if ($(this).parents('[data-fancybox],mew-photos').length === 0) {
        $(this).wrap(`<div class="0"><div data-fancybox="gallery" ${this.alt ? `data-caption="${this.alt}"` : ''} href="${$(this).attr('src')
        }"></div>${(this.alt && DreamConfig.show_img_name) ? `<p>${this.alt}</p>` : ''}</div>`)
      }
    })
  },
  /* 实现当前菜单高亮 */
  initNavbar() {
    const $nav_menus = $('.navbar-nav a')
    const $nav_side_menus = $('.panel-side-menu .link')
    let activeIndex = 0
    const { href, pathname } = location

    if (pathname && pathname !== '/') {
      for (let i = 0; i < $nav_menus.length; i++) {
        const cur_href = $nav_menus[i].getAttribute('href')
        if (pathname.includes(cur_href) || href.includes(cur_href)) {
          activeIndex = i
          if (pathname === cur_href || href === cur_href) break
        }
      }
    }

    // 高亮PC端
    const $curMenu = $nav_menus.eq(activeIndex)
    // 点击菜单后，将该菜单设置current高亮css，不需要移除逻辑，因为每次点击都是重新渲染新的html页面
    // 因此要实现侧边栏分类树，在点击后重新请求新的页面，同样要处理相应的分类树选择逻辑
    $curMenu.addClass('current')
    if ($curMenu.parents('.item-dropdown').length) {
      $curMenu
        .parents('.item-dropdown')
        .find('.item-dropdown-link a')
        .addClass('current')
    }

    // 高亮移动端
    $nav_side_menus.eq(activeIndex).addClass('current')
  },
  /* 激活导航栏全局下拉框功能 */
  // initDropMenu() {
  //   $('.item-dropdown').each(function (index, item) {
  //     const menu = $(this).find('.item-dropdown-menu')
  //     const trigger = $(item).attr('trigger') || 'click'
  //     const placement = $(item).attr('placement') || $(this).height() || 0
  //     menu.css('top', placement)
  //     if (trigger === 'hover') {
  //       $(this).hover(
  //         () => $(this).addClass('active'),
  //         () => $(this).removeClass('active')
  //       )
  //     } else {
  //       $(this).on('click', function (e) {
  //         e.stopPropagation()
  //         $(this).toggleClass('active')
  //         $(document).one('click', () => $(this).removeClass('active'))
  //         e.stopPropagation()
  //       })
  //       menu.on('click', (e) => e.stopPropagation())
  //     }
  //   })
  // }
  /** 分类树初始化 */
  initCategoryTree() {
    const $categories_Tree = $('.card.widget.categories > ul > li')
    // console.log('$categories_Tree:', $categories_Tree)
    expandCategoryTree($categories_Tree)
  }
}

// 在现代JavaScript开发中，我们倾向于使用模块来封装代码，以保持全局命名空间的清洁和避免命名冲突。
// 然而，在某些情况下，你可能需要让某个函数在全局作用域中可用，以便它可以被来自不同模块或第三方库的代码访问。
// 这时，将函数赋值给window对象是一个可行的解决方案。
// window.commonContext = commonContext

!(function () {
  // 若没有将common放到body最后，需要再html加载完后执行菜单高亮才行
  const loads = ['initCarousel', 'sparkInput', 'websiteTime','initNavbar','initCategoryTree']
  const omits = ['initEffects', 'loadMaintain', 'showThemeVersion']

  Object.keys(commonContext).forEach(
    (c) => !loads.includes(c) && !omits.includes(c) && commonContext[c]()
  )

  // 当前html加载完执行
  document.addEventListener('DOMContentLoaded', function () {
    $('html').addClass('loaded')
    loads.forEach((c) => commonContext[c] && commonContext[c]())
  })

  // 所有内容加载完执行
  window.addEventListener('load', function () {
    omits.forEach((c) => commonContext[c] && commonContext[c]())
    $('html').addClass('ready')
  })
})()