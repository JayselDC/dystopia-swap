import Head from 'next/head';
import { Typography, Button, Paper, SvgIcon, Grid, Avatar } from "@material-ui/core";
import Layout from '../../components/layout/layout.js';
import Overview from '../../components/ffDashboardOverview';
import VoteOverview from '../../components/ffDashboardVoteOverview';
import ClaimAll from '../../components/ffDashboardClaimAll';

import classes from './dashboard.module.css';

import React, { useState, useEffect } from 'react';
import { ACTIONS } from '../../stores/constants';
import stores from '../../stores';
import { useRouter } from "next/router";
import Unlock from '../../components/unlock';
import { formatAddress } from '../../utils';

const { CONNECT_WALLET, ACCOUNT_CONFIGURED } = ACTIONS

function BalanceIcon(props) {
  const { color, className } = props;
  return (
    <SvgIcon viewBox="0 0 64 64" strokeWidth="1" className={className}>
      <g strokeWidth="1" transform="translate(0.5, 0.5)"><line data-color="color-2" x1="9" y1="39" x2="13" y2="39" fill="none" stroke="#4585d6" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="1" strokeLinejoin="miter"></line><line data-color="color-2" x1="32" y1="16" x2="32" y2="20" fill="none" stroke="#4585d6" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="1" strokeLinejoin="miter"></line><line data-color="color-2" x1="48.263" y1="22.737" x2="45.435" y2="25.565" fill="none" stroke="#4585d6" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="1" strokeLinejoin="miter"></line><line data-color="color-2" x1="55" y1="39" x2="51" y2="39" fill="none" stroke="#4585d6" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="1" strokeLinejoin="miter"></line><line data-color="color-2" x1="28.464" y1="35.464" x2="16" y2="23" fill="none" stroke="#4585d6" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="1" strokeLinejoin="miter"></line><circle data-color="color-2" cx="31.999" cy="39" r="5" fill="none" stroke="#4585d6" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="1" strokeLinejoin="miter"></circle><path d="M57.372,55A30,30,0,1,0,6.628,55Z" fill="none" stroke="#4585d6" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="1" strokeLinejoin="miter"></path></g>
      </SvgIcon>
  );
}

function Dashboard({ changeTheme }) {

  function handleNavigate(route) {
    router.push(route);
  }

  const accountStore = stores.accountStore.getStore('account');
  const router = useRouter();
  const [account, setAccount] = useState(accountStore);
  const [unlockOpen, setUnlockOpen] = useState(false);

  useEffect(() => {
    const accountConfigure = () => {
      const accountStore = stores.accountStore.getStore('account');
      setAccount(accountStore);
      closeUnlock();
    };
    const connectWallet = () => {
      onAddressClicked();
    };

    stores.emitter.on(ACCOUNT_CONFIGURED, accountConfigure);
    stores.emitter.on(CONNECT_WALLET, connectWallet);
    return () => {
      stores.emitter.removeListener(ACCOUNT_CONFIGURED, accountConfigure);
      stores.emitter.removeListener(CONNECT_WALLET, connectWallet);
    };
  }, []);

  const onAddressClicked = () => {
    setUnlockOpen(true);
  };

  const closeUnlock = () => {
    setUnlockOpen(false);
  };

  return (
    <Layout changeTheme={changeTheme}>
      <Head>
        <title>Dashboard - Solid Swap</title>
      </Head>
      <div className={classes.ffContainer}>
        {account && account.address ?
          <>

          <div className={classes.connected}>
            <Grid container spacing={5} className={classes.contentGrid}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Grid container spacing={4}>
                  <Grid item lg={3} md={6} sm={12} xs={12}>
                    <Typography className={classes.mainHeading} variant='h1'>Staking</Typography>
                    <Paper elevation={0} onClick={() => router.push('/liquidity')} className={classes.viewCollateral}>View</Paper>
                    <Overview />
                  </Grid>

                  <Grid item lg={3} md={6} sm={12} xs={12}>
                    <Typography className={classes.mainHeading} variant='h1'>Vesting</Typography>
                    <Paper elevation={0} onClick={() => router.push('/vest')} className={classes.viewVesting}>View</Paper>
                    <Overview />
                  </Grid>

                  <Grid item lg={3} md={6} sm={12} xs={12}>
                    <Typography className={classes.mainHeading} variant='h1'>Voting</Typography>
                    <Paper elevation={0} onClick={() => router.push('/vote')} className={classes.viewVoting}>View</Paper>
                    <VoteOverview />
                  </Grid>

                  <Grid item lg={3} md={6} sm={12} xs={12}>
                    <Typography className={classes.mainHeadingRewards} variant='h1'>Rewards</Typography>
                    <ClaimAll />
                  </Grid>
                </Grid>
              </Grid>

            </Grid>

          </div>
          </>
           :
           <Paper className={classes.notConnectedContent}>
             <BalanceIcon className={ classes.overviewIcon } />
             <Typography className={classes.mainHeadingNC} variant='h1'>Dashboard</Typography>
             <Typography className={classes.mainDescNC} variant='body2'>An overview Assets.</Typography>
             <Button
               disableElevation
               className={classes.buttonConnect}
               variant="contained"
               onClick={onAddressClicked}>
               {account && account.address && <div className={`${classes.accountIcon} ${classes.metamask}`}></div>}
               <Typography>Connect Wallet to Continue</Typography>
             </Button>
           </Paper>
         }
         {unlockOpen && <Unlock modalOpen={unlockOpen} closeModal={closeUnlock} />}
      </div>
    </Layout>
  );
}

export default Dashboard;
