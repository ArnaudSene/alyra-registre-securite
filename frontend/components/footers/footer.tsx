
const Footer = () => {

    return (
        <footer className="absolute bottom-0 w-full bg-gray-950 text-gray-100 border-gray-500 border-t">
            <nav className="flex flex-col md:flex-row mx-auto justify-between text-center p-4">
                <div className="mx-auto">
                    © 2023
                    <span className="text-rose-500"> Registre de sécurité </span>
                    <span className="text-cyan-400 italic"> RS+</span>
                    . Tous droits réservés.
                </div>
            </nav>
        </footer>
    )
}
export default Footer;