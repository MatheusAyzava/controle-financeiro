export const formatarMoeda = (valor: number, ocultar: boolean = false): string => {
  if (ocultar) {
    return '••••••';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

export const formatarData = (data: string): string => {
  // Parse da data sem problemas de timezone
  // Se a data vier no formato YYYY-MM-DD, vamos parsear manualmente
  const partes = data.split('-');
  if (partes.length === 3) {
    const ano = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Mês é 0-indexed no JavaScript
    const dia = parseInt(partes[2], 10);
    const dataObj = new Date(ano, mes, dia);
    return dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
  // Fallback para o método original
  return new Date(data).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatarDataHora = (data: string): string => {
  return new Date(data).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
