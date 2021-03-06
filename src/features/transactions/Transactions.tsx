import React, { useEffect, useState } from 'react';
import { css } from '@emotion/css';
import { Container } from 'reactstrap';
import { getTransactions, postTransaction } from '../../services/transactions';
import { TTransaction, TTransactionPayload } from '../../types/transaction';
import { Placeholder } from '../../ui/Placeholder';
import { AddTransaction } from './AddTransaction';
import { Transaction } from './Transaction';
import { useDispatch, useSelector } from 'react-redux';
import { setTransactions } from '../../store/actions/transactions.actions';
import { selectTransactions } from '../../store/reducers';

export function Transactions() {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const [editingTrans, setEditingTrans] = useState<TTransaction | null>(null);

  useEffect(() => {
    getTransactions().then((transactions) => {
      dispatch(setTransactions(transactions));
    });
  }, [dispatch]);

  const handleSelect = (transaction: TTransaction) => {
    setEditingTrans(transaction);
  };

  const handleAddTransaction = (transaction: TTransactionPayload) => {
    postTransaction(transaction).then((result) => {
      if (result) {
        const currentTrans = transactions ? transactions : [];

        dispatch(setTransactions([result, ...currentTrans]));
      }
    });
  };

  return (
    <div className={pageStyle}>
      <Container className={containerStyle}>
        <Placeholder ready={transactions !== null}>
          {() => (
            <div className={listStyle}>
              {transactions?.map((transaction) => (
                <Transaction
                  transaction={transaction}
                  onSelect={handleSelect}
                  key={transaction.id}
                />
              ))}
            </div>
          )}
        </Placeholder>
      </Container>
      <Container className={css({ paddingTop: '1rem', paddingBottom: '1rem' })}>
        <AddTransaction transaction={editingTrans} onSubmit={handleAddTransaction} />
      </Container>
    </div>
  );
}

const pageStyle = css({
  display: 'grid',
  gridAutoRows: '1fr auto',
  overflow: 'auto',
});

const containerStyle = css({
  backgroundColor: 'var(--white)',
  borderRadius: '0.25rem',
  overflow: 'auto',
  paddingBottom: '1rem',
  paddingTop: '1rem',
});

const listStyle = css({
  display: 'grid',
  gap: '1.5rem',
  gridTemplateRows: 'auto',
});
