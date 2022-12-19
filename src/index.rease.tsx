import 'rease/jsx'

import { TypeReaseContext } from 'rease'
import type { TypeReaseSubject } from 'rease'
import { createReaseApp, listen, subject } from 'rease'

import debounce from 'debounce-safe'

import { style } from './style.rease'
import { CARDS, TypeCard } from './lib/cards'
import { shuffle, spliceFromNum, last } from './lib/utils'

const cardBGPosition = (card: TypeCard): string =>
  `background-position:${card.ox}% ${card.oy}%;`

const create_cards = (
  CARDS: TypeCard[],
  key: number,
  $update: TypeReaseSubject<any>,
  final: boolean
): void => {
  let card!: TypeCard
  const $view = subject<boolean>()

  ;(
    <r-watch
      r-is={($update!! && (card = CARDS[key]) &&
        (card.cards = CARDS, card.final = final,
        $view.set(card.view = card.view || key === CARDS.length - 1)), card)}

      r-children={() => {
        if (card) {
          <div
            id={card.id}
            class={style.$card}
            class-view={$view!!}
            style={$view!! && cardBGPosition(card)}
          >
            <r-if
              r-is={$update!! && key + 1 < CARDS.length}
              r-children={() => { create_cards(CARDS, key + 1, $update, final) }}
            />
          </div>
        }
      }}
    />
  )
}

const create_box_for_finals = (
  CARDS: TypeCard[],
  $update: TypeReaseSubject<any>,
  final: boolean
): void => {
  <r-watch r-is={$update!! && last(CARDS, 0)} r-children={(card0) => {
    if (card0) {
      const card1 = last(CARDS, 1)
      if (card1) { <div class={style.$card} style={cardBGPosition(card1)}/> }
      create_cards(CARDS, CARDS.length - 1, $update, final)
    }
  }}/>
}

function set_card_in_cards_finals(
  card: TypeCard, cards: TypeCard[], cards_final: TypeCard[], update: Function,
  UNDO_LIST: (() => void)[], REDO_LIST: (() => void)[]
): boolean {
  let res = false
  let cardLast: TypeCard
  if (!cards_final.length && !card.value ||
    (cardLast = last(cards_final, 0)!) &&
    cardLast.value + 1 === card.value &&
    cardLast.color === card.color &&
    cardLast.suit === card.suit) {
    res = true

    let lastIsView: boolean
    const next = (): void => {
      cards_final.push(cards.pop()!)
      if (cards.length) lastIsView = last(cards, 0)!.view
      UNDO_LIST.push(prev)
    }
    const prev = (): void => {
      if (!lastIsView) cards.forEach((v) => { v.view = false })
      cards.push(cards_final.pop()!)
      REDO_LIST.push(next)
    }
    REDO_LIST.length = 0
    next()
    update()
  }
  return res
}

function set_card_in_cards_places(
  card: TypeCard, cards: TypeCard[], cards_final: TypeCard[], update: Function,
  UNDO_LIST: (() => void)[], REDO_LIST: (() => void)[]
): boolean {
  let res = false
  let cardLast: TypeCard
  if (!cards_final.length && card.value === 12 ||
    (cardLast = last(cards_final, 0)!) &&
    cardLast.value === card.value + 1 &&
    cardLast.color !== card.color) {
    res = true

    let lastIsView: boolean
    const next = (): void => {
      const cardsIdx = cards.indexOf(card)
      if (cardsIdx > -1) {
        cards_final.push(...cards.splice(cardsIdx, cards.length))
        if (cards.length) lastIsView = last(cards, 0)!.view
      }
      UNDO_LIST.push(prev)
    }
    const prev = (): void => {
      const cardsIdx = cards_final.indexOf(card)
      if (cardsIdx > -1) {
        if (!lastIsView) cards.forEach((v) => { v.view = false })
        cards.push(...cards_final.splice(cardsIdx, cards_final.length))
      }
      REDO_LIST.push(next)
    }
    REDO_LIST.length = 0
    next()
    update()
  }
  return res
}

function CardBox(
  this: TypeReaseContext,
): void {
  <td>
    <div class={style.$card_box} r-use={this.use}>
      <r-slot/>
    </div>
  </td>
}

const TITLES = {
  reset : 'Shuffle and retake',
  retake: 'Just retake',
  undo  : 'Undo',
  redo  : 'Redo',
  info  : 'About',
  
}

createReaseApp(document.body, function(this: TypeReaseContext) {
  style.on()

  /*
    <CHECK_DIRECTION
  */
  const $maxWidth = subject('')
  const $isLandscape = subject(false)
  const direction = (): void => {
    const isLandscape = innerWidth > innerHeight
    $isLandscape.set(isLandscape)
    $maxWidth.set(isLandscape ? innerHeight * 1.25 + 'px' : '')
  }
  direction(), listen(window, 'resize', debounce(direction, 150))
  /*
    /CHECK_DIRECTION
  */

  const $isWin = subject(false)
  const $isInfo = subject(false)

  const getCardFromCardsClosed = (): boolean => {
    if (CARDS_CLOSED.length) {
      const next = (): void => {
        CARDS_OPENED.push(CARDS_CLOSED.pop()!)
        UNDO_LIST.push(prev)
      }
      const prev = (): void => {
        CARDS_CLOSED.push(CARDS_OPENED.pop()!)
        REDO_LIST.push(next)
      }
      REDO_LIST.length = 0
      next()
    } else if (CARDS_OPENED.length) {
      const next = (): void => {
        CARDS_CLOSED.push(...CARDS_OPENED.splice(0, CARDS_OPENED.length).reverse())
        UNDO_LIST.push(prev)
      }
      const prev = (): void => {
        CARDS_OPENED.push(...CARDS_CLOSED.splice(0, CARDS_CLOSED.length).reverse())
        REDO_LIST.push(next)
      }
      REDO_LIST.length = 0
      next()
    } else {
      return false
    }
    update()
    return true
  }

  let CTO: any
  const $update = subject({})
  const update = (): void => {
    $update.set({})

    // if (!$isPreWin.get()) {
    if (CARDS_BOXES_PLACES.every((ctx) => !ctx.pub.CARDS.length || ctx.pub.CARDS[0].view)) {
      if (CARDS_BOXES_PLACES.every((ctx) => !ctx.pub.CARDS.length)) {
        CTO = setTimeout((): void => { $isWin.set(true) }, 1000)
      } else {
        clearTimeout(CTO), CTO = setTimeout(runAutoEnd, 150)
      }
    }
  }

  const runAutoEnd = (): void => {
    let CARDS: TypeCard[], CARDS_FINALS: TypeCard[]
    for (let i = 0; i < CARDS_BOXES_PLACES.length; i++) {
      CARDS = CARDS_BOXES_PLACES[i].pub.CARDS

      if (CARDS.length) {
        for (let j = 0; j < CARDS_BOXES_FINALS.length; j++) {
          CARDS_FINALS = CARDS_BOXES_FINALS[j].pub.CARDS
          if (set_card_in_cards_finals(
            last(CARDS, 0)!, CARDS, CARDS_FINALS, update, UNDO_LIST, REDO_LIST
          )) {
            return
          }

          if (CARDS_OPENED.length) {
            if (set_card_in_cards_finals(
              last(CARDS_OPENED, 0)!, CARDS_OPENED, CARDS_FINALS, update, UNDO_LIST, REDO_LIST
            )) {
              return
            }
          }
        }
      }

      if (CARDS_OPENED.length) {
        if (set_card_in_cards_places(
          last(CARDS_OPENED, 0)!, CARDS_OPENED, CARDS, update, UNDO_LIST, REDO_LIST
        )) {
          return
        }
      }
    }

    getCardFromCardsClosed()
  }

  /*
    <CONTAINER_FOR_MOVE_CARDS
  */
  let dragged: null | { node: HTMLElement, card: TypeCard }
  const draggedReset = (): void => {
    if (dragged) {
      dragged.node.style.zIndex = ''
      dragged.node.style.transform = ''
      dragged = null
    }
  }
  const draggedMove = debounce((offset: { x: number, y: number }): void => {
    if (dragged) {
      dragged.node.style.transform = `translate(${offset.x}px,${offset.y}px)`
    }
  })
  /*
    /CONTAINER_FOR_MOVE_CARDS
  */

  /*
    <CARDS_LISTS
  */
  let UNDO_LIST!: (() => void)[], REDO_LIST!: (() => void)[]
  let CARDS_LIST: TypeCard[], CARDS_OBJ: { [key: string]: TypeCard }
  let CARDS_CLOSED: TypeCard[], CARDS_OPENED: TypeCard[]
  let CARDS_BOXES: TypeReaseContext[]
  let CARDS_BOXES_FINALS: TypeReaseContext[]
  let CARDS_BOXES_PLACES: TypeReaseContext[]
  const use_set_card_boxes = (CARDS: TypeCard[], box: TypeReaseContext[]) =>
    (ctx: any): void => { ctx.pub.CARDS = CARDS, box.push(ctx), CARDS_BOXES.push(ctx) }

  const $newgame = subject({})
  const new_game = (isShuffle: boolean): void => {
    clearTimeout(CTO)
    draggedReset()
    isShuffle && shuffle(CARDS)
    UNDO_LIST = [], REDO_LIST = []
    CARDS_LIST = CARDS.slice(), CARDS_OBJ = {}
    for (let card: TypeCard, i = CARDS_LIST.length; i-- > 0;) {
      card = CARDS_LIST[i], card.view = card.final = false
      CARDS_OBJ[card.id = 'card-' + i] = card, card.cards = []
    }
    CARDS_CLOSED = CARDS_LIST, CARDS_OPENED = []
    CARDS_BOXES = [], CARDS_BOXES_FINALS = [], CARDS_BOXES_PLACES = []

    $newgame.set({})
  }
  new_game(true)

  /*
    /CARDS_LISTS
  */
  
  /*
    <FIX_CLICK_AFTER_MOVE
  */
  // let isAllowClick = true
  // const allowClick = debounce((): void => { isAllowClick = true })
  // const disallowClick = (): void => { isAllowClick = false, allowClick() }
  /*
    /FIX_CLICK_AFTER_MOVE
  */

  ;(
    <div class={[style.$root, $isLandscape!! && 'landscape']}>

      <div class={style.$btns}>

        <a href="#" class={style.$btn}
          title={TITLES.reset}
          r-on-click-prevent={debounce(() => { new_game(true) }, 150, true)}
        ><div class="reset"/></a>

        <a href="#" class={style.$btn}
          title={TITLES.retake}
          r-on-click-prevent={debounce(() => { new_game(false) }, 150, true)}
        ><div class="retake"/></a>

        <a href="#" class={style.$btn}
          title={TITLES.undo}
          class-disabled={$newgame!! && $update!! && !UNDO_LIST.length}
          r-on-click-prevent-stop={debounce(() => {
            if (UNDO_LIST.length) UNDO_LIST.pop()!(), update()
          }, 150, true)}
        ><div class="undo"/></a>

        <a href="#" class={style.$btn}
          title={TITLES.redo}
          class-disabled={$newgame!! && $update!! && !REDO_LIST.length}
          r-on-click-prevent={debounce(() => {
            if (REDO_LIST.length) REDO_LIST.pop()!(), update()
          }, 150, true)}
        ><div class="redo"/></a>

        <a href="#" class={style.$btn}
          title={TITLES.info}
          r-on-click-prevent={debounce(() => { $isInfo.set(true) }, 150, true)}
        ><div class="info"/></a>

      </div>

      <div class={style.$game} style-max-width={$maxWidth!!}>

        <r-watch r-is={$newgame!!} r-children={() => {
          <table
        
            r-on-taptrack-05-capture={(e) => {
              switch (e.step) {
                case 'start': {
                  draggedReset()
                  // @ts-ignore
                  let id = e.target.id
      
                  if (id in CARDS_OBJ) {
                    let node = e.target as any
                    for (;node; node = node.children[0]) {
                      id = node.id
                      if (id in CARDS_OBJ && CARDS_OBJ[id].view) {
                        node.style.zIndex = '2'
                        dragged = { node, card: CARDS_OBJ[id] }
                        break
                      }
                    }
                  }
                  break
                }
                case 'move': {
                  draggedMove(e.offset)
                  break
                }
                case 'end': {
                  if (dragged) {
                    // disallowClick()
                    const { node, card } = dragged
                    const cards = card.cards
      
                    const { top, left, right, bottom } = node.getBoundingClientRect()
      
                    const variants: [number, boolean, TypeCard[]][] = []
      
                    let x1: number, y1: number
                    let rect_final: DOMRect, cards_final_temp: TypeCard[]
                    for (let ctx: any, i = CARDS_BOXES.length; i-- > 0;) {
                      ctx = CARDS_BOXES[i]
                      cards_final_temp = ctx.pub.CARDS
                      if (cards_final_temp !== cards) {
                        rect_final = ctx.node.getBoundingClientRect()
      
                        x1 = left < rect_final.left
                          ? right - rect_final.left : rect_final.right - left
                        y1 = top < rect_final.top
                          ? bottom - rect_final.top : rect_final.bottom - top
      
                        if (x1 > 0 && y1 > 0) {
                          variants.push([x1 * y1, i < 4, cards_final_temp])
                        }
                      }
                    }
      
                    variants.sort((a, b) => a[0] - b[0])
      
                    let item: typeof variants[number]
                    const isLast = card === last(cards, 0)
                    for (let i = variants.length; i-- > 0;) {
                      item = variants[i]
                      if (item[1]) {
                        if (isLast && set_card_in_cards_finals(
                          card, cards, item[2], update, UNDO_LIST, REDO_LIST
                        )) {
                          break
                        }
                      } else {
                        // eslint-disable-next-line no-lonely-if
                        if (set_card_in_cards_places(
                          card, cards, item[2], update, UNDO_LIST, REDO_LIST
                        )) {
                          break
                        }
                      }
                    }
                  }
                  draggedReset()
                  break
                }
                default:
              }
            }}

            r-on-tapend={((e) => {
              // if (isAllowClick) {
              // @ts-ignore
              const id = e.target.id
    
              if (id in CARDS_OBJ) {
                const card = CARDS_OBJ[id], cards = card.cards
                if (card.view && card === last(cards, 0) && !card.final) {
                  for (let l = CARDS_BOXES_FINALS.length, i = 0; i < l; i++) {
                    if (set_card_in_cards_finals(
                      card, cards, CARDS_BOXES_FINALS[i].pub.CARDS, update, UNDO_LIST, REDO_LIST
                    )) break
                  }
                }
              }
              // }
            })}

          >
            <tr>
              <CardBox r-on-tapend-stop={debounce(getCardFromCardsClosed, 150, true)}
              >
                <div class={$update!! && CARDS_CLOSED.length > 0 && style.$card}/>
              </CardBox>

              <CardBox>
                <r-void r-is={create_box_for_finals(CARDS_OPENED, $update, false)}/>
              </CardBox>

              <td><div class={style.$fixer}/></td>

              <r-void r-is={
                [
                  [],
                  [],
                  [],
                  [],
                ].forEach((CARDS) => {
                  <CardBox r-use={[use_set_card_boxes(CARDS, CARDS_BOXES_FINALS)]}>
                    <r-void r-is={create_box_for_finals(CARDS, $update, true)}/>
                  </CardBox>
                })
              }/>
            </tr>
            <tr>
              <r-void r-is={
                [
                  spliceFromNum(CARDS_LIST, 1),
                  spliceFromNum(CARDS_LIST, 2),
                  spliceFromNum(CARDS_LIST, 3),
                  spliceFromNum(CARDS_LIST, 4),
                  spliceFromNum(CARDS_LIST, 5),
                  spliceFromNum(CARDS_LIST, 6),
                  spliceFromNum(CARDS_LIST, 7),
                ].forEach((CARDS) => {
                  <CardBox r-use={[use_set_card_boxes(CARDS, CARDS_BOXES_PLACES)]}>
                    <r-void r-is={create_cards(CARDS, 0, $update, false)}/>
                  </CardBox>
                })
              }/>
            </tr>
          </table>
        }}/>

      </div>

    </div>
  )

  ;(
    <div
      class={[style.$popup, style.$win]}
      class-show={$isWin!!}
      r-on-tapend={() => { new_game(true), $isWin.set(false) }}
    >
      <div>YOU WIN</div>
    </div>
  )

  ;(
    <div
      class={[style.$popup, style.$info]}
      class-show={$isInfo!!}
      r-on-tapend={debounce(() => { $isInfo.set(false) })}
    >
      <div>
        <h4>Interface:</h4>
        <table>
          <tr>
            <td><div class={style.$btn}><div class="reset"/></div></td>
            <td>- {TITLES.reset}</td>
          </tr>
          <tr>
            <td><div class={style.$btn}><div class="retake"/></div></td>
            <td>- {TITLES.retake}</td>
          </tr>
          <tr>
            <td><div class={style.$btn}><div class="undo"/></div></td>
            <td>- {TITLES.undo}</td>
          </tr>
          <tr>
            <td><div class={style.$btn}><div class="redo"/></div></td>
            <td>- {TITLES.redo}</td>
          </tr>
        </table>
        <hr/>
        <h4>Homepage:</h4>
        <a href="https://github.com/wareset/rease-example-solitaire" target="_blank">Rease example: Solitaire</a>
        <br/>
        <br/>
        <h4>Texture:</h4>
        <a href="https://www.freepik.com/free-vector/deck-gangsta-playing-cards_8083771.htm" target="_blank">Deck of gangsta playing cards</a>
        <br/>
        and
        <br/>
        <a href="https://www.freepik.com" target="_blank">designed by Dgim-Studio - Freepik.com</a>
      </div>
    </div>
  )
})
