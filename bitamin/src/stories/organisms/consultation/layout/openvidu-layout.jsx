import $ from 'jquery'

class OpenViduLayout {
  layoutContainer
  opts

  fixAspectRatio(elem, width) {
    const sub = elem.querySelector('.OT_root')
    if (sub) {
      const oldWidth = sub.style.width
      sub.style.width = width + 'px'
      sub.style.width = oldWidth || ''
    }
  }

  positionElement(elem, x, y, width, height, animate) {
    const targetPosition = {
      left: x + 'px',
      top: y + 'px',
      width: width + 'px',
      height: height + 'px',
    }

    this.fixAspectRatio(elem, width)

    if (animate && $) {
      $(elem).stop()
      $(elem).animate(
        targetPosition,
        animate.duration || 200,
        animate.easing || 'swing',
        () => {
          this.fixAspectRatio(elem, width)
          if (animate.complete) {
            animate.complete.call(this)
          }
        }
      )
    } else {
      $(elem).css(targetPosition)
    }
    this.fixAspectRatio(elem, width)
  }

  getVideoRatio(elem) {
    if (!elem) {
      return 3 / 4
    }
    const video = elem.querySelector('video')
    if (video && video.videoHeight && video.videoWidth) {
      return video.videoHeight / video.videoWidth
    } else if (elem.videoHeight && elem.videoWidth) {
      return elem.videoHeight / elem.videoWidth
    }
    return 3 / 4
  }

  getCSSNumber(elem, prop) {
    const cssStr = $(elem).css(prop)
    return cssStr ? parseInt(cssStr, 10) : 0
  }

  cheapUUID() {
    return (Math.random() * 100000000).toFixed(0)
  }

  getHeight(elem) {
    const heightStr = $(elem).css('height')
    return heightStr ? parseInt(heightStr, 10) : 0
  }

  getWidth(elem) {
    const widthStr = $(elem).css('width')
    return widthStr ? parseInt(widthStr, 10) : 0
  }

  getBestDimensions(minR, maxR, count, WIDTH, HEIGHT, targetHeight) {
    let maxArea, targetCols, targetRows, targetWidth, tWidth, tHeight, tRatio

    for (let i = 1; i <= count; i++) {
      const colsAux = i
      const rowsAux = Math.ceil(count / colsAux)

      tHeight = Math.floor(HEIGHT / rowsAux)
      tWidth = Math.floor(WIDTH / colsAux)

      tRatio = tHeight / tWidth
      if (tRatio > maxR) {
        tRatio = maxR
        tHeight = tWidth * tRatio
      } else if (tRatio < minR) {
        tRatio = minR
        tWidth = tHeight / tRatio
      }

      const area = tWidth * tHeight * count

      if (maxArea === undefined || area > maxArea) {
        maxArea = area
        targetHeight = tHeight
        targetWidth = tWidth
        targetCols = colsAux
        targetRows = rowsAux
      }
    }
    return {
      maxArea: maxArea,
      targetCols: targetCols,
      targetRows: targetRows,
      targetHeight: targetHeight,
      targetWidth: targetWidth,
      ratio: targetHeight / targetWidth,
    }
  }

  arrange(
    children,
    WIDTH,
    HEIGHT,
    offsetLeft,
    offsetTop,
    fixedRatio,
    minRatio,
    maxRatio,
    animate
  ) {
    let targetHeight

    const count = children.length
    let dimensions

    if (!fixedRatio) {
      dimensions = this.getBestDimensions(
        minRatio,
        maxRatio,
        count,
        WIDTH,
        HEIGHT,
        targetHeight
      )
    } else {
      const ratio = this.getVideoRatio(children.length > 0 ? children[0] : null)
      dimensions = this.getBestDimensions(
        ratio,
        ratio,
        count,
        WIDTH,
        HEIGHT,
        targetHeight
      )
    }

    let x = 0,
      y = 0
    const rows = []
    let row

    for (let i = 0; i < children.length; i++) {
      if (i % dimensions.targetCols === 0) {
        row = {
          children: [],
          width: 0,
          height: 0,
        }
        rows.push(row)
      }
      const elem = children[i]
      row.children.push(elem)
      let targetWidth = dimensions.targetWidth
      targetHeight = dimensions.targetHeight
      if (fixedRatio) {
        targetWidth = targetHeight / this.getVideoRatio(elem)
      }
      row.width += targetWidth
      row.height = targetHeight
    }

    let totalRowHeight = 0
    let remainingShortRows = 0
    for (let i = 0; i < rows.length; i++) {
      row = rows[i]
      if (row.width > WIDTH) {
        row.height = Math.floor(row.height * (WIDTH / row.width))
        row.width = WIDTH
      } else if (row.width < WIDTH) {
        remainingShortRows += 1
      }
      totalRowHeight += row.height
    }
    if (totalRowHeight < HEIGHT && remainingShortRows > 0) {
      let remainingHeightDiff = HEIGHT - totalRowHeight
      totalRowHeight = 0
      for (let i = 0; i < rows.length; i++) {
        row = rows[i]
        if (row.width < WIDTH) {
          let extraHeight = remainingHeightDiff / remainingShortRows
          if (extraHeight / row.height > (WIDTH - row.width) / row.width) {
            extraHeight = Math.floor(
              ((WIDTH - row.width) / row.width) * row.height
            )
          }
          row.width += Math.floor((extraHeight / row.height) * row.width)
          row.height += extraHeight
          remainingHeightDiff -= extraHeight
          remainingShortRows -= 1
        }
        totalRowHeight += row.height
      }
    }

    y = (HEIGHT - totalRowHeight) / 2
    for (let i = 0; i < rows.length; i++) {
      row = rows[i]
      const rowMarginLeft = (WIDTH - row.width) / 2
      x = rowMarginLeft
      for (let j = 0; j < row.children.length; j++) {
        const elem = row.children[j]

        let targetWidth = dimensions.targetWidth
        targetHeight = row.height
        if (fixedRatio) {
          targetWidth = Math.floor(targetHeight / this.getVideoRatio(elem))
        }
        elem.style.position = 'absolute'
        const actualWidth =
          targetWidth -
          this.getCSSNumber(elem, 'paddingLeft') -
          this.getCSSNumber(elem, 'paddingRight') -
          this.getCSSNumber(elem, 'marginLeft') -
          this.getCSSNumber(elem, 'marginRight') -
          this.getCSSNumber(elem, 'borderLeft') -
          this.getCSSNumber(elem, 'borderRight')

        const actualHeight =
          targetHeight -
          this.getCSSNumber(elem, 'paddingTop') -
          this.getCSSNumber(elem, 'paddingBottom') -
          this.getCSSNumber(elem, 'marginTop') -
          this.getCSSNumber(elem, 'marginBottom') -
          this.getCSSNumber(elem, 'borderTop') -
          this.getCSSNumber(elem, 'borderBottom')

        this.positionElement(
          elem,
          x + offsetLeft,
          y + offsetTop,
          actualWidth,
          actualHeight,
          animate
        )
        x += targetWidth
      }
      y += targetHeight
    }
  }

  filterDisplayNone(element) {
    return element.style.display !== 'none'
  }

  updateLayout() {
    if (this.layoutContainer.style.display === 'none') {
      return
    }
    let id = this.layoutContainer.id
    if (!id) {
      id = 'OT_' + this.cheapUUID()
      this.layoutContainer.id = id
    }

    const HEIGHT =
      this.getHeight(this.layoutContainer) -
      this.getCSSNumber(this.layoutContainer, 'borderTop') -
      this.getCSSNumber(this.layoutContainer, 'borderBottom')
    const WIDTH =
      this.getWidth(this.layoutContainer) -
      this.getCSSNumber(this.layoutContainer, 'borderLeft') -
      this.getCSSNumber(this.layoutContainer, 'borderRight')

    const availableRatio = HEIGHT / WIDTH

    let offsetLeft = 0
    let offsetTop = 0
    let bigOffsetTop = 0
    let bigOffsetLeft = 0

    const bigOnes = Array.prototype.filter.call(
      this.layoutContainer.querySelectorAll(
        '#' + id + '>.' + this.opts.bigClass
      ),
      this.filterDisplayNone
    )
    const smallOnes = Array.prototype.filter.call(
      this.layoutContainer.querySelectorAll(
        '#' + id + '>*:not(.' + this.opts.bigClass + ')'
      ),
      this.filterDisplayNone
    )

    if (bigOnes.length > 0 && smallOnes.length > 0) {
      let bigWidth, bigHeight

      if (availableRatio > this.getVideoRatio(bigOnes[0])) {
        bigWidth = WIDTH
        bigHeight = Math.floor(HEIGHT * this.opts.bigPercentage)
        offsetTop = bigHeight
        bigOffsetTop = HEIGHT - offsetTop
      } else {
        bigHeight = HEIGHT
        bigWidth = Math.floor(WIDTH * this.opts.bigPercentage)
        offsetLeft = bigWidth
        bigOffsetLeft = WIDTH - offsetLeft
      }
      if (this.opts.bigFirst) {
        this.arrange(
          bigOnes,
          bigWidth,
          bigHeight,
          0,
          0,
          this.opts.bigFixedRatio,
          this.opts.bigMinRatio,
          this.opts.bigMaxRatio,
          this.opts.animate
        )
        this.arrange(
          smallOnes,
          WIDTH - offsetLeft,
          HEIGHT - offsetTop,
          offsetLeft,
          offsetTop,
          this.opts.fixedRatio,
          this.opts.minRatio,
          this.opts.maxRatio,
          this.opts.animate
        )
      } else {
        this.arrange(
          smallOnes,
          WIDTH - offsetLeft,
          HEIGHT - offsetTop,
          0,
          0,
          this.opts.fixedRatio,
          this.opts.minRatio,
          this.opts.maxRatio,
          this.opts.animate
        )
        this.arrange(
          bigOnes,
          bigWidth,
          bigHeight,
          bigOffsetLeft,
          bigOffsetTop,
          this.opts.bigFixedRatio,
          this.opts.bigMinRatio,
          this.opts.bigMaxRatio,
          this.opts.animate
        )
      }
    } else if (bigOnes.length > 0 && smallOnes.length === 0) {
      this.arrange(
        bigOnes,
        WIDTH,
        HEIGHT,
        0,
        0,
        this.opts.bigFixedRatio,
        this.opts.bigMinRatio,
        this.opts.bigMaxRatio,
        this.opts.animate
      )
    } else {
      this.arrange(
        smallOnes,
        WIDTH - offsetLeft,
        HEIGHT - offsetTop,
        offsetLeft,
        offsetTop,
        this.opts.fixedRatio,
        this.opts.minRatio,
        this.opts.maxRatio,
        this.opts.animate
      )
    }
  }

  arrangeParticipantsList(
    children,
    WIDTH,
    HEIGHT,
    offsetLeft,
    offsetTop,
    fixedRatio,
    minRatio,
    maxRatio,
    animate
  ) {
    const targetHeight = HEIGHT
    const dimensions = this.getBestDimensions(
      minRatio,
      maxRatio,
      children.length,
      WIDTH,
      targetHeight,
      targetHeight
    )

    let x = 0,
      y = 0

    for (let i = 0; i < children.length; i++) {
      const elem = children[i]
      let targetWidth = dimensions.targetWidth
      if (fixedRatio) {
        targetWidth = targetHeight / this.getVideoRatio(elem)
      }
      this.positionElement(
        elem,
        x + offsetLeft,
        y + offsetTop,
        targetWidth,
        targetHeight,
        animate
      )
      x += targetWidth
    }
  }

  updateLayoutWithParticipantsList() {
    if (this.layoutContainer.style.display === 'none') {
      return
    }
    let id = this.layoutContainer.id
    if (!id) {
      id = 'OT_' + this.cheapUUID()
      this.layoutContainer.id = id
    }

    const HEIGHT =
      this.getHeight(this.layoutContainer) -
      this.getCSSNumber(this.layoutContainer, 'borderTop') -
      this.getCSSNumber(this.layoutContainer, 'borderBottom')
    const WIDTH =
      this.getWidth(this.layoutContainer) -
      this.getCSSNumber(this.layoutContainer, 'borderLeft') -
      this.getCSSNumber(this.layoutContainer, 'borderRight')

    const participantsHeight = Math.floor(
      HEIGHT * this.opts.participantsListPercentage
    )
    const mainHeight = HEIGHT - participantsHeight

    const participants = Array.prototype.filter.call(
      this.layoutContainer.querySelectorAll('#' + id + '>.participant'),
      this.filterDisplayNone
    )
    const mainVideos = Array.prototype.filter.call(
      this.layoutContainer.querySelectorAll('#' + id + '>:not(.participant)'),
      this.filterDisplayNone
    )

    this.arrangeParticipantsList(
      participants,
      WIDTH,
      participantsHeight,
      0,
      0,
      this.opts.fixedRatio,
      this.opts.minRatio,
      this.opts.maxRatio,
      this.opts.animate
    )
    this.arrange(
      mainVideos,
      WIDTH,
      mainHeight,
      0,
      participantsHeight,
      this.opts.fixedRatio,
      this.opts.minRatio,
      this.opts.maxRatio,
      this.opts.animate
    )
  }

  initLayoutContainer(container, opts) {
    this.opts = {
      maxRatio: opts.maxRatio != null ? opts.maxRatio : 3 / 2,
      minRatio: opts.minRatio != null ? opts.minRatio : 9 / 16,
      fixedRatio: opts.fixedRatio != null ? opts.fixedRatio : false,
      animate: opts.animate != null ? opts.animate : false,
      bigClass: opts.bigClass != null ? opts.bigClass : 'OT_big',
      bigPercentage: opts.bigPercentage != null ? opts.bigPercentage : 0.8,
      bigFixedRatio: opts.bigFixedRatio != null ? opts.bigFixedRatio : false,
      bigMaxRatio: opts.bigMaxRatio != null ? opts.bigMaxRatio : 3 / 2,
      bigMinRatio: opts.bigMinRatio != null ? opts.bigMinRatio : 9 / 16,
      bigFirst: opts.bigFirst != null ? opts.bigFirst : true,
      participantsListPercentage:
        opts.participantsListPercentage != null
          ? opts.participantsListPercentage
          : 0.2,
    }
    this.layoutContainer =
      typeof container === 'string' ? $(container) : container
  }

  setLayoutOptions(options) {
    this.opts = options
  }
}

export default OpenViduLayout
