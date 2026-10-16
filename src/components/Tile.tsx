export default function Tile(props : {
    children?: React.ReactNode,
    className?: string;
}){
    return (
        <div 
            className={`
                flex
                flex-col
                w-full
                max-w-xl
                min-w-0
                bg-(--bg)
                rounded-2xl
                p-6
                sm:p-8
                gap-4
                ${props.className}
            `}
        >
            {props.children}
        </div>
    )
}