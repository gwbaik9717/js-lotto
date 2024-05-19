import Lotto from "../src/js/domain/Lotto";
import LottoGame from "../src/js/domain/LottoGame";
import LottoNumber from "../src/js/domain/LottoNumber";
import LottoResult from "../src/js/domain/LottoResult";

describe("로또 당첨 기능 테스트", () => {
  test.each([
    [
      6,
      LottoResult.LottoRanking["FIRST"],
      {
        lottoNumbers: [1, 2, 3, 4, 5, 6],
        winningNumbers: [1, 2, 3, 4, 5, 6],
        bonusNumber: 7,
      },
    ],
    [
      4,
      LottoResult.LottoRanking["FOURTH"],
      {
        lottoNumbers: [1, 2, 3, 4, 8, 10],
        winningNumbers: [1, 2, 3, 4, 5, 6],
        bonusNumber: 7,
      },
    ],
  ])(
    "로또 당첨 등수를 구하려고 할 때 로또 번호와 당첨 번호가 일치하는 갯수가 %s개 이면 %s등이다.",
    (_, expectedResult, testSet) => {
      // given
      const lotto = new Lotto(testSet.lottoNumbers);
      const winningLotto = new Lotto(testSet.winningNumbers);
      const bonusNumber = new LottoNumber(testSet.bonusNumber);
      const lottoResult = new LottoResult(winningLotto, bonusNumber);

      // when
      const lottoRanking = lottoResult.getLottoRanking(lotto);

      // then
      expect(lottoRanking.ranking).toBe(expectedResult);
    }
  );

  test("로또 당첨 등수를 구하려고 할 때 등수에 들지 못한다면 null을 반환한다.", () => {
    // given
    const lotto = new Lotto([1, 2, 3, 4, 5, 6]);
    const winningLotto = new Lotto([10, 11, 12, 13, 14, 15]);
    const bonusNumber = new LottoNumber(8);
    const lottoResult = new LottoResult(winningLotto, bonusNumber);

    // when
    const lottoRanking = lottoResult.getLottoRanking(lotto);

    // then
    expect(lottoRanking).toBeNull();
  });

  test("로또 당첨 결과를 구하려고 할 때 각 등수별로 총 몇 개의 로또가 당첨되었는지 반환한다.", () => {
    // given
    const lottoNumbers = [
      [1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12],
      [1, 2, 3, 4, 9, 10],
    ];
    const lottos = lottoNumbers.map((lottoNumbers) => new Lotto(lottoNumbers));
    const winningLotto = new Lotto([1, 2, 3, 4, 5, 6]);
    const bonusNumber = new LottoNumber(7);
    const lottoResult = new LottoResult(winningLotto, bonusNumber);
    const lottoRankings = [
      LottoResult.LottoRanking["FIRST"],
      LottoResult.LottoRanking["SECOND"],
      LottoResult.LottoRanking["THIRD"],
      LottoResult.LottoRanking["FOURTH"],
      LottoResult.LottoRanking["FIFTH"],
    ];

    // when
    const lottoRankingCounts = lottoRankings.map((lottoRanking) =>
      lottoResult.getLottoRankingCount(lottos, lottoRanking)
    );

    // then
    expect(lottoRankingCounts).toEqual([1, 0, 0, 1, 0]);
  });

  test.each([
    [
      "일치하는 것이 있으",
      LottoResult.LottoRanking["SECOND"],
      {
        lottoNumbers: [1, 2, 3, 4, 5, 12],
        winningNumbers: [1, 2, 3, 4, 5, 9],
        bonusNumber: 12,
      },
    ],
    [
      "일치하는 것이 없으",
      LottoResult.LottoRanking["THIRD"],
      {
        lottoNumbers: [1, 2, 3, 4, 5, 12],
        winningNumbers: [1, 2, 3, 4, 5, 9],
        bonusNumber: 7,
      },
    ],
  ])(
    "로또 번호와 당첨번호가 일치하는 갯수가 5개일 때 로또 번호 중 보너스 번호와 %s면 %s등이다.",
    (_, expectedResult, testSet) => {
      // given
      const lotto = new Lotto(testSet.lottoNumbers);
      const winningLotto = new Lotto(testSet.winningNumbers);
      const bonusNumber = new LottoNumber(testSet.bonusNumber);
      const lottoResult = new LottoResult(winningLotto, bonusNumber);

      // when
      const lottoRanking = lottoResult.getLottoRanking(lotto);

      // then
      expect(lottoRanking.ranking).toBe(expectedResult);
    }
  );

  test("로또 당첨 수익률을 계산할 때 결과 값은 총 상금 / 로또를 구입한 금액 이다.", () => {
    // given
    const purchasedAmount = 8000;
    const availableLottoCount =
      LottoGame.getPurchasableLottoCount(purchasedAmount);
    const lottoNumbers = [
      [8, 21, 23, 41, 42, 43],
      [3, 5, 11, 16, 32, 38],
      [7, 11, 16, 35, 36, 44],
      [1, 8, 11, 31, 41, 42],
      [13, 14, 16, 38, 42, 45],
      [7, 11, 30, 40, 42, 43],
      [2, 13, 22, 32, 38, 45],
      [1, 3, 5, 14, 22, 45],
    ];
    const lottos = [];

    for (let i = 0; i < availableLottoCount; i++) {
      lottos.push(new Lotto(lottoNumbers[i]));
    }

    const winningLotto = new Lotto([1, 2, 3, 4, 5, 6]);
    const bonusNumber = new LottoNumber(7);
    const lottoResult = new LottoResult(winningLotto, bonusNumber);
    const totalLottoWinningPrice =
      lottoResult.getTotalLottoWinningPrice(lottos);

    // when
    const totalLottoProfitRate = LottoResult.getTotalLottoProfitRate(
      totalLottoWinningPrice,
      purchasedAmount
    );

    // then
    expect(totalLottoProfitRate).toBe(62.5);
  });
});
