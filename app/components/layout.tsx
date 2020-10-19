import Head from 'next/head';
import AuthButtons from '@app/components/auth-buttons';
import styled from 'styled-components';
import Link from 'next/link';

export function Layout({ children }) {
  return (
    <>
      <Head>
        <title>GMKit</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Nav>
        <NavTitle>
          <Link href="/">
            gmkit
          </Link>
        </NavTitle>

        <AuthButtons />
      </Nav>
      <Main>
        {children}
      </Main>
    </>
  );
}

const Main = styled.main`
  margin: 0 2.5rem;
`

const Nav = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0 2.5rem;
`

const NavTitle = styled.h1`
  flex-grow: 1;
`