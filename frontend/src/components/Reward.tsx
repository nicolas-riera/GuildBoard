interface RewardProps {
    gold: number;
    xp?: number;
    large?: boolean;
    separator?: string;
}

export default function Reward({ gold, xp, large = false, separator = "/" }: RewardProps) {
    return (
        <span className={large ? "reward reward--lg" : "reward"}>
            <span className="reward__gold">{gold} gold</span>
            {xp !== undefined && (
                <>
                    <span className="reward__sep">{separator}</span>
                    <span className="reward__xp">{xp} xp</span>
                </>
            )}
        </span>
    );
}
