import { TableBalanceteMovimentacoesList } from "./table-list-balancete-movimentacao";
import type { BalanceteMovimentacaoList } from "../model/balancete-movimentacao-model";

interface TableBalanceteMovimentacaoProps {
  movimentacaoList: BalanceteMovimentacaoList[];
  handleListData: () => void;
}

export function TableBalanceteMovimentacao({
  movimentacaoList,
  handleListData,
}: TableBalanceteMovimentacaoProps) {
  return (
    <TableBalanceteMovimentacoesList
      movimentacaoList={movimentacaoList}
      handleListData={handleListData}
    />
  );
}
