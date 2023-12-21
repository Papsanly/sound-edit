import styles from './ScrollBar.module.css'

export default function ScrollBar({
  start,
  end,
  vertical,
  horizontal,
  style: extraStyles,
}) {
  let style
  if (horizontal) {
    style = {
      width: `${end - start}px`,
    }
  } else if (vertical) {
    style = {
      height: `${end - start}px`,
    }
  }

  return (
    <div
      data-vertical={vertical}
      data-horizontal={horizontal}
      className={styles.scrollBar}
      style={{ ...style, ...extraStyles }}
    >
      <div className={styles.start} />
      <div className={styles.end} />
    </div>
  )
}
