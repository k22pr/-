## 마루마루 클리너

### 개요

해당프로그램은 js공부를 위해 제작되었습니다. jQuery를 안쓰고 만들어 보려했는데 결국은 쓰게됬네요...

서버지기는 마루마루 사이트를 싫어하며 개인적인 사정이 있지 않는 한 **마루마루가 망할때까지 지속적으로 업데이트 됩니다.**

---


### 마루마루 구조

마루마루는 [FuckAdBlock](https://github.com/sitexw/FuckAdBlock/blob/master/fuckadblock.js])를 통해 AdBlock / AdGuard등의 광고차단 확장 프로그램을 검증합니다.

FuckAdBlock은 [MIT License](https://github.com/sitexw/FuckAdBlock/blob/master/LICENSE)로 배포됩니다.

> **MIT License**
> - 이 소프트웨어를 누구라도 무상으로 제한없이 취급해도 좋다. 단, 저작권 표시 및 이 허가 표시를 소프트웨어의 모든 복제물 또는 중요한 부분에 기재해야 한다.
> - 저자 또는 저작권자는 소프트웨어에 관해서 아무런 책임을 지지 않는다.

---

머루머루가 사용하는 FuckAdBlock는 총 5번에 걸쳐 1~201ms동안 광고를 차단했는지를 검사합니다.

광고차단이 일어나면 root문서를 지우고 많이 보시던 **'Attention : Please, Turn off Ad-block extensions.'** 라는 문구를 띄웁니다.
AdBlock / AdGuard등의 광고차단 확장프로그램은 background에서 즉시 광고에대한 Request를 차단하기 때문에 FuckAdBlock에 검증 됩니다.

(기존 확장프로그램을 이용해 FuckAdBlock를 무력화 하시려면 사용자 규칙으로 plugin02.js를 차단하면 됩니다.)

 ---


### 클리너 원리

> 마루마루 클리너는 총 3단계에 걸쳐 클-린하게 만들어 줍니다.
 > 1. wasabisyrup.com 에서 **요청되는 모든 script와 stylesheer를 차단**합니다. (background에서 동작)
 > 2. (1번 실패시) FuckAdBlock보다 먼저 root문서를 제거해 고의적으로 오류를 일으켜 기능을 마비시킵니다.
 > 3. (2번 실패시) 모든 광고를 css로 가린뒤 광고 element를 삭제합니다.

위의 과정을 거쳐 페이지가 지워졌다면 이미지등 필요한 정보만을 객체에 저장시킨 뒤 새롭게 페이지를 작성합니다.

확장프로그램이 페이지 로드보다 먼저 작동한다는 전제하에 모든 리소스를 차단한 뒤 페이지 자체를 삭제 시켜 아예 페이지를 새로 작성하는 개념입니다.

> 개인적으로 마루마루측 개발자를 상당히 낮게 평가하고 있어서 당분간 막힐일은 없을 것 같습니다.
> 저를 고생하게 할 우회법이야 많지만 머루머루가 볼 수 있으니 서술하진 않겠습니다.
