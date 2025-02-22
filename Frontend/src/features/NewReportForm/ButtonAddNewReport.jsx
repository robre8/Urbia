import React from 'react'
import { LuMapPinPlusInside } from "react-icons/lu";
import styles from './ButtonAddNewReport.module.css';

const ButtonAddNewReport = () => {
  return (
    <button className={styles.button}>
        <LuMapPinPlusInside />
    </button>
  )
}

export default ButtonAddNewReport