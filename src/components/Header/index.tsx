import React from 'react'
import Web3Status from '../Web3Status';
import Logo from "../../assets/img/logo-kryxivia.png";
import { Link, LinkProps, useMatch, useResolvedPath } from 'react-router-dom';

function CustomLink({ children, to, ...props }: LinkProps) {
    let resolved = useResolvedPath(to);
    let match = useMatch({ path: resolved.pathname, end: true });
  
    return (
      <div>
        <Link
          className={match ? "bt bt-act" : "bt"}
          to={to}
          {...props}
        >
          {children}
        </Link>
      </div>
    );
  }
  
export const Header: React.FC = () => {

        return (
            <header id="h">
                <div className="l">
                    <a href="https://kryxivia.io" className="lg" title="Kryxivia">
                        <img src={Logo} alt="Kryxivia" />
                    </a>
                    <nav id="n">
                        <ul>
                            <li>
                                <CustomLink to="/">
                                    <span>NFTs</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M437.333 192h-32v-42.667C405.333 66.99 338.344 0 256 0S106.667 66.99 106.667 149.333V192h-32C68.771 192 64 196.771 64 202.667v266.667C64 492.865 83.135 512 106.667 512h298.667C428.865 512 448 492.865 448 469.333V202.667c0-5.896-4.771-10.667-10.667-10.667zM287.938 414.823c.333 3.01-.635 6.031-2.656 8.292a10.67 10.67 0 0 1-7.948 3.552h-42.667a10.67 10.67 0 0 1-7.948-3.552c-2.021-2.26-2.99-5.281-2.656-8.292l6.729-60.51c-10.927-7.948-17.458-20.521-17.458-34.313 0-23.531 19.135-42.667 42.667-42.667s42.667 19.135 42.667 42.667c0 13.792-6.531 26.365-17.458 34.313l6.728 60.51zM341.333 192H170.667v-42.667C170.667 102.281 208.948 64 256 64s85.333 38.281 85.333 85.333V192z" />
                                    </svg>
                                </CustomLink>
                            </li>
                        </ul>
                    </nav>
                </div>
                <Web3Status />
            </header>
        );
}