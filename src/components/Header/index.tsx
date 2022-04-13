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
                                    <span>NFTs Portfolio</span>
                                </CustomLink>
                            </li>
                            <li>
                                <CustomLink to="/bundle">
                                    <span>NFT Boxes</span>
                                </CustomLink>
                            </li>
                            <li>
                                <CustomLink to="/stake">
                                    <span>Staking</span>
                                </CustomLink>
                            </li>
                            <li>
                                <CustomLink to="/mint-firework">
                                    <span>Alpha Firework</span>
                                </CustomLink>
                            </li>
                        </ul>
                    </nav>
                </div>
                <Web3Status />
            </header>
        );
}