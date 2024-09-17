

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
}


window.commonContext = commonContext

!(function () {
  // 若没有将common放到body最后，需要再html加载完后执行菜单高亮才行
  const loads = ['initCarousel', 'sparkInput', 'websiteTime','initNavbar']
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