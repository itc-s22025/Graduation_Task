"use client";

import React from 'react';  // Make sure React is imported
import AccountHeader from "@/components/AccountHeader";
import MainLayout from "@/components/MainLayout";
import s from "./setting.module.css";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/navigation";

const SettingPage = (props) => {
    // const router = useRouter();
    const router = useRouter()


    return (
    <>
      <MainLayout>
          <div className={s.allContainer}>
              <AccountHeader title="Settings"/>
              {/*<div className="content">*/}
              <ul className={s.ul}>
                  <Link href="/Settings/Info" className={s.box}>
                      <Image src="/human.png" alt="i" width={25} height={25} className={s.img}/>
                      <h2 className={s.font}>Account Information</h2>
                  </Link>
                  <Link href="/Settings/ChangePwd/" className={s.box}>
                      <Image src="/key.png" alt="i" width={25} height={25} className={s.img}/>
                      <h2 className={s.font2}>Change Password</h2>
                  </Link>
                  <Link href="/Settings/DeleteAccount" className={s.box}>
                      <h2 >Delete Account</h2>
                  </Link>
              </ul>
          </div>
          {/*</div>*/}
      </MainLayout>
    </>
    );
}
export default SettingPage;