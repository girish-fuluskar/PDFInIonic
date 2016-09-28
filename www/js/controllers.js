angular.module('starter.controllers', ['base64'])

.controller('DashCtrl', function($scope) {
   
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('createPDF', function($scope, $filter, $ionicModal, $base64, $cordovaFileOpener2, $ionicPlatform, $cordovaToast, StorageService, $ionicListDelegate, $cordovaFile, $cordovaFile, $cordovaEmailComposer, $state){
  var vm = this;

  //Adding values to local storage
  $scope.addStorage = function (date, particulars, amount) {
    StorageService.add(date, particulars, amount);
    $scope.fileName = particulars;
    $scope.date = "";
    $scope.particulars = "";
    $scope.amount = "";
  };
   
  //Retriving values from local storage for creating PDF
  $scope.createPDFFromStorage = function(){
    // Initialize the modal view.
    $ionicModal.fromTemplateUrl('pdf-viewer', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        vm.modal = modal;
    });

    //Getting all records from local storage
    $scope.storageItems = StorageService.getAll();

    //Mapping local stoarage values according to document defination
    var items = $scope.storageItems.map(function(item) {
          return [item.date = $filter('date')(item.date, "dd/MM/yyyy"), item.particulars, JSON.stringify(item.amount)];
      });

//Creating document defination for PDF
  var documentDefination = {
    pageSize: 'LEGAL',
      pageOrientation: 'portrait',
      pageMargins: [40, 140, 40, 120],
      header: {
          margin: 8,
          columns: [
              {
                  table: {
                      widths: [ '50%','50%'],
                      body: [
                          [
                              { image: 'data:image/jpeg;base64,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dix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX87NHnUBYsedR51V/Oo86gLFjzqPOqv51HnUBYsedR51VvtAz1FL51ArFjzqPOqv51HnUDsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsWPOo86q/nUedQFix51HnVX86jzqAsfZ3/BJabjx/8A9w7/ANuqKh/4JKSbh8QP+4d/7dUV+j5B/uMPn+bP5e8RP+ShxH/bn/pEThP+Cwb/APGxf4if9w3/ANNlpXzRvr6O/wCCwsn/ABsZ+InP/QN/9NlpXzP5nvXwOZf73V/xS/Nn9GcMr/hHwn/Xqn/6Si1vo31V8z3o8z3riPbsz1D9lX9l7xV+2H8Y7DwX4Rtkkv7oGa4uJjtt9Pt1IDzynqFXcOgJJIABJFfbPi0/sX/8Eybv/hHdb0i9+PnxOsAYtSHlpPY2c4A3RujuLaMbgflxPKnIY1y/wu8ZTf8ABO7/AII3X/j7Rnaz+Ivx31VtI02+QbZtOso/NTehyCCEjndWHR54z/CK6L4E/D/4ff8ABH79iDw18bPHnhS08Z/GT4gFZfDemXxGNNSRfMQjcp8tliKvJIF3gyLGCMkn63D4eGGg1onBRc5tc1nLWMIrva1/nrpY/KM7zSrjqzipSdNzdOnThLldSUfjlKW6gndadrvc5zQf+Cun7OHiHU/sniH9jrwRpejPlXutLi064vFX1CfZIOf+2o+tXPi5/wAE8fg/+2V8E9V+Jf7KGr3R1DQIvO1jwNeyyPcxDaW2xrKWlSXh8AtJHIVIRhtwfZf+Cdn7felf8FVvjjY+Hfi58OvCtr418FyJ4q8L63o0MkXkfZpoiYW815JAclGOHKOAcqpVSfBU/bS1bTf+DgXU/EGj3tydL1DxZD4HurdZP3d1aKY7BlI6ECVPNH+0oNdEqNKuqVKtJS9s2oyUbOOyTf8A287OPb3k3seVQli8PiKywMJ0alCHPKMqjnCfXl1/mjdqV009LdT4PguhOmefcelK1yink194j/gn9ofxx/4Lo+OvhsUaDwZYXr+KNUghkKMbeSGC4eBCOVDT3KpwQQjHBBArtPj5/wAF4P8AhQfxi1L4dfCr4VeBD8MPCV5Lo9zb3cDxHVRE5SXyViKxQoWDgF0l3DDEDO0eBSy2Coxq4qpyOV7K19tG9OienV+R9xV4qrVKkaOXYd1ZckZy95RUVLWKu07yfbT1PzaFwpPWvZX/AGqvCMX7Fk3wt/4VJ4afxfLeC5Xx4Wg/tKNPtKzeUB9n8zGwGP8A1/Q9McV+gH/BR7xT4E8W/wDBD7Rtf+GelJoHhDXtctNRtdMjAVdOllupmuIAo+Vdk5lXavyjGFwuBXldtdEf8G0+pPnn/hIUGf8AuMxVs8BOhVxNBS/hxV9N7um7eVnLddvM8x8UUsdh8PiKtBq+I5EuZpxa5vedlrtrB6X6ux+dwmCqMmux/Z8+LGj/AAZ+M2geJ9c8K6b450nR52mudCvygttSUoy7H3xyLgFg3KN90cd6/TX9iD4r+GvgT/wQ0g+IPijQLfxRB4I1m71XT9NuD+6uNQF6YrXdwRgSyq2cHbjcBlRXi/7N/wDwUx8df8FBv+Ch37P0Xi7R/DOijw1rF66Lo0MsaXJltnALiWSRsqqYGGwdxOK2pZWqeIowjV/eTdNr3bpKdnd30utdOqSva+l1eKa+JoYz/Zb0aPtYylz2vyKWisrq+mqfu82l7Hxn+0N8WtI+OPxw8QeKtA8IaZ4B0bV5I3ttA04xm204LEkZVCkcS4ZlLnCLy569TxjXSKeWFfpLL8DfCX7R/wDwcReN/DvjWK3vtHtWTUk06dh5WpzQ6baskLD+JeS5X+IRkEFSa7/9q7/gp9+0d+x/8V9a0i3/AGddC0r4SeHLpra1uG0q7mt7uxRtqSLeQOLWHegBCGM+XuCsCRWUcqg6SxGIqcqk3b3W9ur7fiOPFs4SpYLA0OeXs4ytKoo/EtEm03N93p5u7PycaYeWSK+9P+C6Pwl8IfB3TvgQ3hXwp4a8MHWtDu5r9tJ0yCyN66rZ4aXy1XeRvbBbP3j618//APBRj9or4NftMfEjSfFXwl8G654HvLy1ceJLG5s7a2s5rjKlJoFhlcFjmQOSqbtqNjcWr9MP+Cmn7YfhL9iD4a/CDxg/gbR/GvxPudIey8LNqoLWuixeTbtc3OBzu3eQoClWILAOo3BtcHhaf1SvGrJJRlDVK/8AOtPXTt3exy51m2LeYZbWoUZc8o1f3bfLraHxPay1d9dNlqfi2tyjHg19Tf8ABHn9mrwv+1V+2lY6F4vtP7S0PSdLuNZlsWYrHevE0aJHJgglN0oYjPOzByCQfsf9n39pPTv+C2n7I/xU8OfErwT4c07xt4I003mn6pp0TCOCSWOZoJofMZ5YmV4MOvmMrqcHglRwP/Bu5+2b4p1fxqfgo9joP/CJ2mm3/iBLsQy/2ibgy267S/m+X5eHPHl56c1vluXUaeYU4ylzRceaOmj3Vn2tZvrtbrpnnnE+MrZPi4wpOnWpPlmuf4U1dSi0tbprTR63voeGf8FHv22vhV8Rj4p+GfgH4A+DfAlz4d8QtZjxTZ29pBeXUdtI8ciiOK3Vow7qP+WzfKORk8fIaShhX6P+Cv8Agoj46/bF/wCCtnw08I+J9M8K2Gl/Dvxvq9rpsml208U86COeEecZJpFY7YlPyqvJP0HzP/wWFuSf+CnfxZTPAvLPH/gvtq8jFU/aUVjefm5m1ta9owd7dPitbyvfU9XhnGuhXjlEqPI/Z+0b53Pebja7V9Ur3vpe1tLnzyZ1B6195eEfhJ4RuP8AggV4v8aSeFPDcvi+019YIdcfTIDqUSf2haptW42+YBtZlwGxhiO9dBr1yV/4Nq7Nwf8AmYsZ/wC4w9QeBpM/8G2fjY5/5mRP/TnZ16OEwipRxEXr+6jLb+Z05fhzWPPzTO54yeFcU4cmMVN67qPMr7Lftr6s/PKO4BRcnkinGQAV+hngK4K/8G2njRs8jxGoz/3E7OvnL/gkdPn/AIKM/CXn72qSf+k01ccsrti6OF5v4ig72250ntfW1/n5H0NDiX2mAxmO9n/u8qsbX+L2ave9tOb0dvM8AWYN0prXSKeWFfoxr3wT8LftF/8ABxJ4q8M+Mkgu9EF0l8bCZsJqUkOlQSJCwyNykjcV/iVCCME16j+1x/wUt/aN/Y2+K2s6JpP7Oug6X8I/Ddwbe0uv7Iu57W6sUOEkW6t3W2g3oAQhjJjzhgSK1p5RD2Kr16nKpN291vbdvt+LPNq8Z1ZVaeHwlBTnKEZtOah8WyjdXk/OyXnfQ/JaSceUSPSvvb/gud8IvCHwg074EHwp4U8N+GG1rQ7ua/bSdMgsjeuq2eGl8tV3kb2wWz94+teCf8FHf2mPg3+1L430PxV8LPBWs+BtXurWRfE9pPaW1vZXM52MksIhlbc2TKHcohbCEjJNfoX/AMFIP2D/ABX+3r8T/wBm/wAP6Gj2Whad4eup9e1lkzDpduRY4/3pXwwROpIJOFViN8FgJ1cPWw9K0pc8EmtrWqa37aXZwZznipY/L8bir0octZyi+llDRpbu+3e6tufj0Z1B60plCivtP/god+3roXw88FTfs1fAOGfw/wDD3wxJJp/iTVRlLvxHdK22eMsQGMe8ESOceaRtAESgO39hj9q/4A/sN/sr6j41u9P07x7+0BdXTDT9HvtOuAmlRB/LTbcNEYE+UNKzRt5jBwmRg48+OCoSqyiqy5Iq/Nbf/Cr3fltpd6H0P9vYxYGOL+qycpytGCetns5u1oab720V7nxYLuMn7wp3mDFfqx+wb/wVr+JP7efxfsvAXxE+DXhjxH4D8SM9leXukaNdy2umAoxVrkStPE0ZKhTnZjdnPGD88eAvg9o/7OX/AAXr0rwT4eV4tE0fxlAbKFmLfZ4prdZxECeSE83aCecKMnNdSyZSq0I053jVly3tazultfXe+5wQ4wqw+s08XQ5KtGm6nKpqSlFJ/aS0d1azXmfFv2lB3pRKGFfrD/wUV/4K13f7A37WmteBPhr4F8H3txdeVq3i/UdUSV7jULq4iVkRTG6bdkAi+Z94wwAUbct+Tep61deINWu9QvpRLeX873M7hQu6R2LMcDgck8CvNxdCnSkoU58z1T0tZrTTur310221Pa4fzXF5hS+sV6HsoSScfe5nJPXVWVtLPruSb6N9VfM96PM965D6CzLW+jfVXzPejzPegLMtb6N9VfM96PM96Asy1vo31V8z3o8z3oCzLW+jfVXzPejzPegLMtb6N9VfM96PM96Asy1vo31V8z3o8z3oCzLW+jfVXzPejzPegLMtb6N9VfM96PM96Asy1vo31V8z3o8z3oCzLW+jfVXzPejzPegLMtb6N9VfM96PM96Asy1vo31V8z3o8z3oCzLW+jfVXzPejzPegLMtb6N9VfM96PM96Asy1vo31V8z3o8z3oCzLW+jfVXzPejzPegLMtb6N9VfM96PM96Asy1vo31V8z3o8z3oCzLW+jfVXzPejzPegLMtb6N9VfM96PM96Asy1vo31V8z3o8z3oCzLW+jfVXzPejzPegLMtb6N9VfM96PM96Asy1vo31V8z3o8z3oCzLW+jfVXzPejzPegLMtb6N9VfM96PM96Asy1vo31V8z3o8z3oCzLW+jfVXzPejzPegLMtb6N9VfM96PM96Asy1vo31V8z3o8z3oCzLW+jfVXzPejzPegLMtb6N9VfM96PM96Asy1vo31V8z3o8z3oCzLW+jfVXzPejzPegLMtb6N9VfM96PM96Asy1vo31V8z3o8z3oCzLW+jfVXzPejzPegLMtb6N9VfM96PM96Asy1vo31V8z3o8z3oCzPtX/AIJHPx8Qf+4b/wC3dFQ/8Eh2yvxD/wC4b/7d0V+k5A/9gp/P82fy14jf8lFiP+3P/SInn3/BYaX/AI2M/ET/ALhv/pstK+Z/N/zmvo7/AILDS/8AGxn4idP+Yb/6bLSvmfzfpXwOZP8A2yr/AIpfmz+j+GF/wjYT/r1T/wDSEWvN/wA5o83/ADmqvm/SjzfpXFc92x98f8FJLd9f/wCCTH7JeuWUnmaLp8U+nXaoo2/aTGAMnsQbecfnnmu9/wCDhXwpqvxI8E/A34ieH7efVfhzHockaX1qhkt7N5xBJEzkcKJEChSeMxkdevE/8E1Pi74H/a0/Zb1/9k34n6mmhf2tdHUfBGsyFdtpes28QLkj5/NLMq5HmLLKmQSuei0H4oftsf8ABIDwxc+CIvB1n478DaezvpmoyaTc6xp1nFkszRy20kckKktny7jGCDtGMk/YYlU6sKlSd1Cq4zUkr2cY8soS221tfyautvxaFKvhMZSw8OX22GlVtCb5faU6suZSjKzV1s1rbVPpfuP+CHH7HPif4CaL40+PXjDRdR0m2tfDtzb6DYXNuyXN7HgTS3HlEBwpESIn9/e5AxtJ8P8A+CSv7KGq+IfihcftLfFdZPDvw18EzT+KJdU1OJohrN4N0iNApALqkjB96ghnVUXcSdvMfDL/AILf/tK6R8edb8RR3WleKtS8QRR2I8OXmlTS6fZiORjGtvBDIkiOpkdc7yz7hvLFVI97/wCFNftN/wDBVmWLW/2iNS/4Uz8C/Dx/tHUbU2/9ipIkQJd0hnLykgDIluiY0BLIG5U3h50pulUwablTXu3VlF3bc5S+52XVJXDMaeZYepiamZzhTjiOVSlF3lypW9nTja7k7tX9ZWva2B/wSa/bLs/jL/wWZ8ceM9X/AOJd/wALYsr+w0qKbho9skEtvCxHG7yLXb1wWGB1FfIv7W37KnjX9n/9q7xN4N1Lw7rT3t/rVy2imO0eT+24JJWaKS32g+buVlyEyQ2VOCCK7j9n/wDZm+G37UP/AAUNHw8+E3xC8T+DPDULSSeG/EusQx3uoX93bASCSNYvsvl7ijvHyHARSfmbav2v8RP2xP2/v2c/Hlx8P4vhjpnxMjs5mttP8XR+EbyZdVh3ER3Ej21wttCxXBKuBtOc56njjQjicHQVfm9zmjFpc3Mm02tNnfa/R7Ho1cY8szSU8v5Lzpw5qdRum48t1GSbTTVrppaprcx/20fgRrX7NX/Bvp4R8KeI4GtNcttWs7y9tmGGtHuLya48pv8AaQSBW9wa4m3b/jmb1M/9TEn/AKeYq6f/AILG/Efxj4J/4JefCvwP8W9ZstS+MPinXf7Z1eCPyg1vCpuZCoWL5AsXnW8GVyp2nBOM18Mj9vvxqn7Dc37P66Z4X/4Qu4vRfPeG2n/tMOLlbnAk87ysb1A/1WdvfPNVmGJp0sdjIt/ElFW11Xs9PuizjyPKsZj8uw9eNpNYl1ZNaJq803Hybd15H19bNn/g2a1M/wDUxJ/6eYq+bv8AgkO+f+Cjnwk/7Csn/pNNXJD9vrxrH+w3N+z8umeF/wDhC7i9F894baf+0w4uVucCTzvKxvUD/VZ29881xn7Onx81n9mD40eHfHvh+20y81nwzO1zaw6hG8ltIxjZMOqOjEYc9GHOK5f7Ro/X6GI+zD2d/wDt1RT/ACZ9LhuHsZDLMxwskuatKs469J35b9tz7L/aX/Zz8bftO/8ABcr4m6H8OvFWj+D/ABlp0lvq2nX1/fz2R3Q2FnuWJ4Y5H8zaxbGMFVfJ4wel07/gtd+0/wDskfFN/AHxQ8HaP4y1PTbuS0kS60ybTtR1MBiqtBLCBE6NjKuLdt4IPOa+Jvih+2D43+KX7V1/8aBdWvhnxzeXkN/HPoiyQw2ksUKQr5ayPI2CsY3KzMG3MCMHFfUOif8ABx1+0Nouhw2c2k/DHVp4owjX13pF0txMQMb2EV0ke49flQD2rfBZjSpwXLVlTaburcylfrZ7Pp/WnlZhw1jZ0qVOrhadeKpxjq+SUZJWfvJNuL+Wp3v/AAXb+Gfg69+BPwj+L1v4OT4dfEHx4QNX0MxpBcyI9t5zm4RVXdLC5RC5UMRKAw4UKn/BxI2NM/Zx/wCxevf/AEGwr4V/ac/au+IH7ZfxG/4Sj4ia6+sX8MZgs4UjWC10+IsW8uGJcBRnqeWbA3Mx5rqv2y/2+/Gn7c8fgqPxdpnhjTk8CWctjp50e2nhMqSCIMZfNmkyf3K427RyeOmOavmFGpDEKmuXnnFpdklJP56p+rfqdeW8L5hh62XyrS5vYqqpO+3Py8qV9Wla2vb5H2T/AMG8z7tK/aE/7F2z/wDQb2vO/wDg3Afd+3hd/wDYoX3/AKPta+f/ANjv/goD41/YatvGMXhDTfC+ojxxZxWN+dYtp5vKSMSgGLypo8N+9bO7cOBx64v7FP7ZPir9g34rSeM/B9h4f1HVpdNl0totYgmmtxFI8bsQsUsbbsxrg7scnitMFmNGnWw85bQi0/Xmm/8A25DzXhrG1/7T9ml+/wCTk1/ljFO/bVM9p/Yt1m30b/gtjp011MkETfEXVIAznA3yTXMaL9S7KB7mpv8AgtR8HPFHhv8A4KZeMrubQtVa08ay2c+hzR2zumqYtIImWEgHe6yIylR8wOOORn5U134hap4i+JWpeLvNGm63qOqy6z5tizw/Zbl5jNuiO4su1zlfmJGBznmvsjw5/wAHEP7RXhzwVFpEkfgDWLqKHyv7YvtHl+3MccORHOkJYf8AXLHqDXLgq2GeXwwuIk4uLvor3TjFNbqzvHc6sbleZ4fMqeZ4GnGp+6VNxcuW1pOSlezvvZr+l71+0l8E9e/Z6/4N1NO8PeJ7KbTNc/tO1v7qymGJbT7RqhmSN1xlXEbpuU8qSQelcT4Db/jmp8bf9jIv/pzs6+W/il/wVC+K/wAcP2YNV+Fni6XRNe0/XNX/ALavtZubeb+1pp/PEwUOJRCsakBVRYQFRQowAKxtL/b38aaN+xDqfwCh0zwwfBur3ov57x7ac6msgninwsgmEQXdEo5iJwTznkd1TM8O6mIlHRTpxjFdmvZ6fLlav1PJwvC+ZqnR9ulzRxftpWenL712vv2PtT9mrwLqvxy/4N3PiF4e8K2dxrmvWWuyTvYWiGW4byru0uXVUHLN5ILAAEnoAScV4f8A8EQfgF4o+Jn7dng7xHZaPqH/AAjvgyee71XUmhZba2YQSRpCXI2+a0kiAJndjccYUkePfsaf8FC/id+wZrN9c+AtSsWsNV2tf6Rqdubmwu3UEK5UMrq4B+8jqSAAcgAV658Sf+C9P7QHxO8YeGdTuG8H6VY+Gr+PUv7H02wuIrHVZYzlBdbp2mdFPOxZVXIBIJUEb08wwMsRQxdRu8FBNW6xSXNftpe1tdisRkedUKGOy7C04Sp4iVSak5NNe0WseW2/RO9le7vsdl+1P+zx4w/ad/4Lk/Efw54B8UaP4R8Y21xbanpd9qF/PZfvINPtGKxSQxyP5oXcwGOiNzxz1if8Fnv2o/2MvirL8P8A4o+FtF8aahpt49qTeaZNYX2qKGKq9tNCEjkjbAKP5DFgR3r4k+LP7XPjT4u/tT6h8ZGuLXw343vb2DUEm0RZIIrSaGKOJDGJHdgNsYyGZgcsDwcV9R+Hv+Djf9ofQNBt7KfS/hnrU8MQja/vdHuVuJyBjewhuY4tx6nagHoBWGCzGlTguWrKm03fTmUttbPZ9P60WYcN42dKjTq4WnXiqcY2b5JRklraSTvF/LU9G/4Ll/Dzwl4m/Zf+E/xn/wCEJX4b/EXxvcJHqujPGsV1LHJbNK/2hQql5ImWNd7KrYlAYA4Vfdf+Cov/AAUf8c/sGQ/s6R+FhZSaLq9v/aOvW0kIabU7e3jtkNsrnPlhlnc7gNwZE5wGVvyc/al/a6+If7afxBTxJ8RNdOrXdrG0NjaxRLBZ6bEzbjHDEvAHTLHLttXczYFdN+2V+3340/bni8FxeL9M8L6fH4EspbHTzo9tPCZUkEQYy+bNJk/uVxt2jk8egs6hTdeph1yOU4SS6WipXv6uza63a16xT4HxNSOBoY+1SFNVVPW9ue3KlfV22T3Vk9D6k/4LRfss6H4o0rQf2n/hgI73wN8RYoZNb+zqQLW7kGEuWX+DzCPLkBxtmXn5pDXpX7OWm+Hv+Cdf/BK3w18efDHwvsvif8QvFM++71K4h85dBhZ5lDllVmihjESo+zaWd/mYDAHxL8CP+ClPj34A/s0+JfhFDpHhDxZ4E8UGbz7HxDbXM5sxKoEggaKeLywWAcddrjcMEnOl+xj/AMFZvjF+wr4Nm8O+E7rQta8OSStPDpWv2klzb2UjHLtCY5I5EDHkrv25yduSSao47BU61WdFuHOk07X5HvKKXbs1Z9Eki8Vw9nM8uhgalqkaM9nLl9rTtaPM1s11T0dr6s+8v+CdH/BSr9qD9vz9oPw9BJ4U8MaH8M7K5efXtW0vRp4oTCiNi3E9xLKpdn2LtjG/BJ+UAkeMfEq3az/4OVIQxH7zxVpkgx6HTYMV5l8Q/wDg4E/aP8farpE9veeEPDFtpl5FdzWekaU6xamEdXEU7TSyS+W23DCN0LKxBPNeTeOf+CifjT4g/traV8errQfBdn400l7eUW1naXKaddyQIY0eVGnaQnZtU7ZF4RenOel5xhlUw03Jy9nUTk3vbR3XlpZL1fU4MLwhj1PFTjh4Uo1aE6cYxle0ntzNpXbu7tdLHZ/8FpH2/wDBUb4pf7+n/wDputq+Y/N/zmuu/aY/aN179rT49a/8RPE1rpFlrfiIwm5h0yKSK1TyoY4V2LI7sPljUnLHknp0rh/N+lfKVpqVSUl1bP1DJ8LPD4CjQqfFGEU/VRSf4lrzf85o83/Oaq+b9KPN+lZXPSsWvN/zmjzf85qr5v0o836UXCxa83/OaPN/zmqvm/SjzfpRcLFrzf8AOaPN/wA5qr5v0o836UXCxa83/OaPN/zmqvm/SjzfpRcLFrzf85o83/Oaq+b9KPN+lFwsWvN/zmjzf85qr5v0o836UXCxa83/ADmjzf8AOaq+b9KPN+lFwsWvN/zmjzf85qr5v0o836UXCxa83/OaPN/zmqvm/SjzfpRcLFrzf85o83/Oaq+b9KPN+lFwsWvN/wA5o83/ADmqvm/SjzfpRcLFrzf85o83/Oaq+b9KPN+lFwsWvN/zmjzf85qr5v0o836UXCxa83/OaPN/zmqvm/SjzfpRcLFrzf8AOaPN/wA5qr5v0o836UXCxa83/OaPN/zmqvm/SjzfpRcLFrzf85o83/Oaq+b9KPN+lFwsWvN/zmjzf85qr5v0o836UXCxa83/ADmjzf8AOaq+b9KPN+lFwsWvN/zmjzf85qr5v0o836UXCxa83/OaPN/zmqvm/SjzfpRcLFrzf85o83/Oaq+b9KPN+lFwsWvN/wA5o83/ADmqvm/SjzfpRcLFrzf85o83/Oaq+b9KPN+lFwsWvN/zmjzf85qr5v0o836UXCxa83/OaPN/zmqvm/SjzfpRcLFrzf8AOaPN/wA5qr5v0o836UXCxa83/OaPN/zmqvm/SjzfpRcLFrzf85o83/Oaq+b9KPN+lFwsWvN/zmjzf85qr5v0o836UXCxa83/ADmjzf8AOaq+b9KPN+lFwsWvN/zmjzf85qr5v0o836UXCxa83/OaPN/zmqvm/SjzfpRcLFrzf85o83/Oaq+b9KPN+lFwsWvN/wA5o83/ADmqvm/SjzfpRcLFrzf85o83/Oaq+b9KPN+lFwsWvN/zmjzf85qr5v0o836UXCxa83/OaPN/zmqvm/SjzfpRcLFrzf8AOaPN/wA5qr5v0o836UXCx9uf8EgX3D4h/wDcN/8Abuiov+CPL5HxE/7hv/t3RX6VkH+4U/n/AOlM/lTxI/5KPEf9uf8ApuJ5t/wWGm/42M/ET/uG/wDpstK+Z/ONfSH/AAWIm2/8FGviL/3Df/TZaV8zefX5/mb/ANsq/wCKX5s/pThdP+xsJ/16p/8ApCLPnGjzjVbz6PPrhue7Zlh33j+R9K+pf2ff+C0n7RP7OenW+n2fjJPFekWqlYrHxPbf2gEHb9/lbjA6BfN2gcAV8pefR59dWGx1fDu9GTj6Hm5jk+Dx8PZ4ylGaW10nb07H6BT/APByr+0HJCUXwv8ACSMkY8xdJv8AcPfm9I/SvmT9qf8A4KD/ABm/bT/0f4geM7y90VZTLFotnGllp0ZzlcxRgCQrj5WlLsP73WvGPPo8+tMRmmKrrlqzbR52A4SynB1Pa4ahGMu9tfk+hc0jULjw9qFteafcXFje2UqT21zbyGKW3kQhldGXBVgQCCDkEV9KaN/wWe/al8O6HDp1r8W9Qe2gjEStdaRp11OQBj5ppbdpGP8AtMxJ9a+X/Po8+sqOOxFFONKbSfZtHo43JsDjLPF0YzttzRTt6XOi+JnxS8UfG3xzdeJvGfiDVfE+v3vEt7qFw00hUZwi54VBk4RQFUcACsbzjVbz6PPrnc23dndSoQpRUKaskWfONHnGq3n0efSuaWZZ840ecarefR59Fwsyz5xo841W8+jz6LhZlnzjR5xqt59Hn0XCzLPnGjzjVbz6PPouFmWfONHnGq3n0efRcLMs+caPONVvPo8+i4WZZ840ecarefR59Fwsyz5xo841W8+jz6LhZlnzjR5xqt59Hn0XCzLPnGjzjVbz6PPouFmWfONHnGq3n0efRcLMs+caPONVvPo8+i4WZZ840ecarefR59Fwsyz5xo841W8+jz6LhZlnzjR5xqt59Hn0XCzLPnGjzjVbz6PPouFmWfONHnGq3n0efRcLMs+caPONVvPo8+i4WZZ840ecarefR59Fwsyz5xo841W8+jz6LhZlnzjR5xqt59Hn0XCzLPnGjzjVbz6PPouFmWfONHnGq3n0efRcLMs+caPONVvPo8+i4WZZ840ecarefR59Fwsyz5xo841W8+jz6LhZlnzjR5xqt59Hn0XCzLPnGjzjVbz6PPouFmWfONHnGq3n0efRcLMs+caPONVvPo8+i4WZZ840ecarefR59Fwsyz5xo841W8+jz6LhZlnzjR5xqt59Hn0XCzLPnGjzjVbz6PPouFmWfONHnGq3n0efRcLMs+caPONVvPo8+i4WZZ840ecarefR59Fwsyz5xo841W8+jz6LhZlnzjR5xqt59Hn0XCzLPnGjzjVbz6PPouFmWfONHnGq3n0efRcLMs+caPONVvPo8+i4WZZ840ecarefR59Fwsyz5xo841W8+jz6LhZlnzjR5xqt59Hn0XCzLPnGjzjVbz6PPouFmWfONHnGq3n0efRcLMs+caPONVvPo8+i4WZZ840ecarefR59Fwsyz5xo841W8+jz6LhZlnzjR5xqt59Hn0XCzPuT/gjm5cfEb/uGf+3dFR/8EaX8wfEf2/sz/wBvKK/TuHtcvp/P/wBKZ/KHiV/yUmJ/7c/9NxOJ/wCC1vg298Mft+eJdRuYXS18R2dheWkhHyyqlpFbtg+zwtn8PWvk3zf85r9+P21v2GPCX7b3gS30zX2n07VNMZn03VbZQZrRmGCCDw6HjKk9QCCDX55a5/wb6fFeDUZF03xf8Pbu0B/dy3NxeW8jD3RbdwP++jXzWcZBivrMqtGPNGTvp5n61wX4g5T/AGXSwuNqKnUpxUdb2aSsmn6b+Z8Keb/nNHm/5zX3CP8Ag34+MxH/ACM3wx/8GN9/8h0h/wCDfj4zAf8AIzfDH/wY33/yHXk/2Jj/APn0z63/AF54f/6Co/18j4f83/OaPN/zmvt//iH7+Mw/5mb4Zf8Agxvv/kOkH/Bv78ZT/wAzN8Mv/Bjff/IlH9iY/wD59MP9eeH/APoKj/XyPiHzf85o83/Oa+3z/wAG/nxlH/MzfDL/AMGN9/8AIlH/ABD9/Gb/AKGb4Zf+DG+/+Q6P7Ex//Pph/rzw/wD9BUf6+R8Qeb/nNHm/5zX2/wD8Q/Xxm/6Gb4Zf+DG+/wDkOl/4h+vjN/0M3wx/8GN9/wDIdH9iY/8A59MP9eeH/wDoKj/XyPh/zf8AOaPN/wA5r7f/AOIfv4zD/mZvhl/4Mb7/AOQ6Q/8ABv8A/GUD/kZvhl/4Mb7/AORKP7Ex/wDz6Yf688P/APQVH+vkfEPm/wCc0eb/AJzX24f+CAXxkH/MzfDP/wAGF9/8iU0/8EB/jGD/AMjL8NP/AAYXv/yJR/YmP/59MP8AXnh//oKj/XyPiXzf85o83/Oa+2R/wQK+MZP/ACMvw0/8GF7/APIlL/w4I+Mf/Qy/DT/wYXv/AMiUf2Jj/wDn0w/154f/AOgqP9fI+JfN/wA5o83/ADmvtr/hwR8Y/wDoZfhp/wCDC9/+RKP+HBHxj/6GX4af+DC9/wDkSj+xMf8A8+mH+vPD/wD0FR/r5HxL5v8AnNHm/wCc19sn/ggT8Yx/zMvw0/8ABhe//IlJ/wAOC/jH/wBDL8NP/Bhe/wDyJR/YmP8A+fTD/Xnh/wD6Co/18j4n83/OaPN/zmvtf/hwf8Yv+hl+Gv8A4ML3/wCRKT/hwf8AGH/oZfhp/wCDC9/+RKP7Ex//AD6Yf688P/8AQVH+vkfFPm/5zR5v+c19r/8ADg74xf8AQy/DX/wYXv8A8iUh/wCCCPxhB/5GT4a/+DC9/wDkSj+xMf8A8+mH+vPD/wD0FR/r5HxT5v8AnNHm/wCc19q/8OEvjD/0Mnw1/wDBhe//ACJR/wAOEvjD/wBDJ8Nf/Bhe/wDyJR/YmP8A+fTD/Xnh/wD6Co/18j4q83/OaPN/zmvtX/hwl8Yf+hk+Gv8A4ML3/wCRKP8Ahwl8Yf8AoZPhr/4ML3/5Eo/sTH/8+mH+vPD/AP0FR/r5HxV5v+c0eb/nNfav/DhL4w/9DJ8Nf/Bhe/8AyJR/w4R+MP8A0Mnw1/8ABhe//IlH9iY//n0w/wBeeH/+gqP9fI+KvN/zmjzf85r7XH/BA34xE/8AIy/DX/wYXv8A8iU9f+CBHxjb/mZfhp/4ML3/AORKP7Ex/wDz6Yf688P/APQVH+vkfEvm/wCc0eb/AJzX24P+CAXxkI/5GX4Z/wDgwvv/AJEoP/BAL4yAf8jL8M//AAYX3/yJR/YmP/59MP8AXnh//oKj/XyPiPzf85o83/Oa+2W/4IE/GNf+Zl+Gn/gwvf8A5EpD/wAEDfjEP+Zl+Gn/AIML3/5Eo/sTH/8APph/rzw//wBBUf6+R8T+b/nNHm/5zX2v/wAODvjF/wBDL8Nf/Bhe/wDyJR/w4O+MX/Qy/DX/AMGF7/8AIlH9iY//AJ9MP9eeH/8AoKj/AF8j4o83/OaPN/zmvtf/AIcHfGL/AKGX4a/+DC9/+RKP+HB3xi/6GX4a/wDgwvf/AJEo/sTH/wDPph/rzw//ANBUf6+R8Ueb/nNHm/5zX2sf+CB/xiA/5GT4a/8Agwvf/kSk/wCHCXxh/wChk+Gv/gwvf/kSj+xMf/z6Yf688P8A/QVH+vkfFXm/5zR5v+c19rD/AIII/GEn/kZPhr/4ML3/AORKX/hwd8Yv+hl+Gv8A4ML3/wCRKP7Ex/8Az6Yf688P/wDQVH+vkfFHm/5zR5v+c19sf8OC/jH/ANDL8NP/AAYXv/yJR/w4L+Mf/Qy/DT/wYXv/AMiUf2Jj/wDn0w/154f/AOgqP9fI+J/N/wA5o83/ADmvtg/8EDPjEB/yMvw0/wDBhe//ACJSf8ODvjF/0Mvw1/8ABhe//IlH9iY//n0w/wBeeH/+gqP9fI+KPN/zmjzf85r7X/4cHfGL/oZfhr/4ML3/AORKB/wQN+MRP/Iy/DX/AMGF7/8AIlH9iY//AJ9MP9eeH/8AoKj/AF8j4o83/OaPN/zmvtj/AIcF/GP/AKGX4af+DC9/+RKUf8ECfjGR/wAjL8NP/Bhe/wDyJR/YmP8A+fTD/Xnh/wD6Co/18j4m83/OaPN/zmvtof8ABAb4yH/mZfhp/wCDC9/+RKkT/g3++Mr/APMzfDL/AMGN9/8AIlH9iY//AJ9MP9eeH/8AoKj+P+R8Q+b/AJzR5v8AnNfcQ/4N9PjOR/yM3wx/8GN9/wDIdL/xD4/GjH/IzfDH/wAGN9/8h0f2Ljv+fTD/AF54f/6Co/18j4c83/OaPN/zmvuL/iH0+M//AEM3wx/8GN9/8h01v+Dfj4zKf+Rm+GX/AIMb7/5Do/sTHf8APph/rzw//wBBUfx/yPh/zf8AOaPN/wA5r7df/ggB8ZU/5mb4Z/8Agwvv/kSmH/ggR8Yx/wAzL8NP/Bhe/wDyJR/YmP8A+fTD/Xnh/wD6Co/18j4l83/OaPN/zmvtn/hwT8Y/+hl+Gf8A4ML3/wCRKX/hwR8Y/wDoZfhp/wCDC9/+RKP7Ex//AD6Yf688P/8AQVH+vkfEvm/5zR5v+c19tj/ggN8ZD/zMvwz/APBhe/8AyJTv+HAPxl/6Gb4Z/wDgwvv/AJEo/sTH/wDPph/rzw//ANBUf6+R8Reb/nNHm/5zX29/xD/fGX/oZvhl/wCDC+/+RKP+If34y/8AQzfDL/wY33/yJR/YmP8A+fTD/Xnh/wD6Co/18j4h83/OaPN/zmvt7/iH++Mv/QzfDL/wY33/AMiUf8Q/3xl/6Gb4Zf8Agxvv/kSj+xMf/wA+mH+vPD//AEFR/r5HxD5v+c0eb/nNfb3/ABD/AHxl/wChm+GX/gxvv/kSj/iH++Mv/QzfDL/wY33/AMiUf2Jjv+fTD/Xnh/8A6Co/18j4h83/ADmjzf8AOa+3v+If74y/9DN8Mv8AwY33/wAiUn/DgH4y/wDQzfDP/wAGF9/8iUf2Jjv+fTD/AF54f/6Co/18j4i83/OaPN/zmvt3/hwD8Zf+hl+Gf/gwvv8A5Eo/4cA/GX/oZfhn/wCDC+/+RKP7Fx3/AD6Yf688P/8AQVH+vkfEXm/5zR5v+c19u/8ADgH4y/8AQy/DP/wYX3/yJQP+CAPxlP8AzM3wz/8ABhff/IlH9iY7/n0w/wBeeH/+gqP9fI+IvN/zmjzf85r7cb/ggF8ZFH/IzfDP/wAGF9/8iVXm/wCCCvxgh6+Jfhr/AODC9/8AkSj+xMd/z6Yf688P/wDQVH+vkfFfm/5zR5v+c19n/wDDiH4u/wDQy/Db/wAGF7/8iVFN/wAELfi5AOfEfw4P0v7z/wCRaP7Fx3/Pph/rzw//ANBUf6+R8a+b/nNHm/5zX1+//BEP4rxn/kYfh5+F9ef/ACLSJ/wRF+K7n/kYfh7/AOB15/8AItL+xsd/z7Yf688P/wDQVH+vkfIPm/5zR5v+c19lWv8AwQr+Ll393xH8Ofxv7z/5Fq/D/wAEC/jHMOPEvw0/HUL3/wCRKP7Fx3/Pph/rzw//ANBUf6+R8Teb/nNHm/5zX26P+CAHxlP/ADM3wy/8GF9/8iUo/wCDf34yk/8AIzfDL/wY33/yJT/sTH/8+mH+vPD/AP0FR/r5HxD5v+c0eb/nNfcaf8G+fxncf8jP8MP/AAY33/yHT/8AiHs+NOP+Rn+F/wD4Mb7/AOQ6P7Ex/wDz6Yf688P/APQVH+vkfDPm/wCc0eb/AJzX3FL/AMG+3xniHPif4Y/+DG+/+Q6o3X/BBb4wWn3vEvw1P01C9/8AkSj+xcd/z6Yf688P/wDQVH+vkfFfm/5zR5v+c19iTf8ABDf4tQHnxF8O/wAL+8/+Raib/giJ8V1/5mH4e/8Agdef/ItL+xcd/wA+mH+vPD//AEFR/r5HyB5v+c0eb/nNfXv/AA5I+K4/5mD4e/8Agdef/ItNP/BEv4rAf8jB8Pv/AAOvP/kWj+xcd/z6Yf688P8A/QVH+vkfInm/5zR5v+c19cv/AMEUviqg/wCRg+H/AP4HXf8A8i1C/wDwRf8AilH11/wD/wCBt3/8jUv7Gxv/AD7Yf688P/8AQVH+vkfJnm/5zR5v+c19XN/wRp+KC/8AMe8Bf+Bt3/8AI1NP/BG34nj/AJj3gP8A8Dbv/wCRqf8AY2O/59sP9eeH/wDoKj/XyPlPzf8AOaPN/wA5r6rP/BHD4nj/AJj3gP8A8Dbv/wCRqB/wRy+Jx/5j3gP/AMDbv/5Go/sbHf8APth/rzw//wBBUf6+R8qeb/nNHm/5zX1Yv/BG74nt/wAx7wH/AOBt3/8AI1Sx/wDBGL4oy9Nf8A/+Bt3/API1H9jY7/n2w/154f8A+gqP9fI+TvN/zmjzf85r64X/AIIp/FVv+Y/8P/8AwOu//kWl/wCHKHxW/wCg/wDD/wD8Drz/AORaP7Fx3/Pph/rzw/8A9BUf6+R8jeb/AJzR5v8AnNfXP/DlL4q/9DB8P/8AwOu//kWmn/gip8VB/wAx/wCH/wD4HXf/AMi0f2Njv+fbD/Xnh/8A6Co/18j5I83/ADmjzf8AOa+tT/wRZ+KYH/If8Af+B13/API1J/w5d+Kef+Q/4B/8Dbv/AORqP7Fx3/Pph/rzw/8A9BUf6+R8l+b/AJzR5v8AnNfWR/4IwfFID/kP+Af/AANu/wD5GpD/AMEZPiiv/Me8Bf8Agbd//I1P+xMd/wA+mH+vPD//AEFR/r5Hyd5v+c0eb/nNfVx/4I0fFAf8x7wF/wCBt3/8jUH/AII0/FAf8x7wF/4G3f8A8jUf2Ljv+fTD/Xnh/wD6Co/18j5R83/OaPN/zmvq4f8ABGv4oH/mPeAv/A27/wDkakP/AARr+KAP/Ie8B/8Agbd//I1L+xcd/wA+mH+vPD//AEFR/r5Hyl5v+c0eb/nNfVTf8Ec/icv/ADHfAn/gbd//ACNW38P/APgjn4lfXoT4q8UaFb6arZlXSjLPNIPQGSNAv15+lVHJMdJ29mzOrx9w/Tg5vFRdu12/usdd/wAEcPDlzZ+FPHOryRutrqFzZ20LkcO0KzFseuPNWivrP4bfDXR/hD4HsPD2g2otNM06PZGmcs3csx/iYnkk0V+j5ZhHhsNGg3dr9dT+YeKM4jmua1sfBWU2rLySUVfzsj67f7tC/door0zwB8dD9KKKAGP92mUUUAFOTpRRQA6iiigBjnmo3+9RRQBG/WoZO9FFADKUH5TRRQA+kNFFADX+9SUUUARSdDTM0UUAGaKKKAEJ+YUtFFABRRRQAUUUUASR9RViLtRRQBOn3aa/3qKKAK8nWomPNFFABRRRQAUUUUAI/wB2mUUUAC9akoooAen3aWiigBH+7TV+9RRQA7FGKKKAFHWpKKKAJU+9U8FFFAFyLtUlFFZgMf71Qy/1oopobKs3U1Vk6GiirEMozRRQBKn3qlTpRRQBInSnUUUkAUUUUwCiiigBjn5qax+WiiswGbqN1FFACqfmp9FFUgIbg8Vh6metFFIDOJ5qreniiikBk3B5psJ+aiiswN/Rjgiun04/LRRVoC/SofmoorUC7bVYz+7ooqWBS1A/LXNa33oopAcvfH56ouaKKQDH+7UTmiip6AVbo1n3HWiiswKsp5qJ/vUUVQEb/epKKKAHxH+dX7T7340UUAaltU1FFWgGvUT9aKKgCGToajPWiitAI3+7UUlFFMCB/u0yiikADrSOfloopPYCvKf51Vk60UVIEb9aKKKpAf/Z',
                                width: 595, height: 120,
                              }
                          ]
                      ]
                  },
                  layout: 'noBorders'
              }
          ]
      },
      content: [
                  {
                    style: 'tableExample',
                    table: {
                        widths: ['*', 75, 75],
                        body: [
                          [
                            { text: 'Date', style: 'itemsTableHeader' },
                            { text: 'Particulars', style: 'itemsTableHeader' },
                            { text: 'Amount', style: 'itemsTableHeader' },
                          ]
                        ].concat(items)
                    }
                  }
                ],
                styles: {
                    header: {
                        fontSize: 20,
                        bold: true,
                        margin: [0, 0, 0, 5],
                        alignment: 'right'
                    },
                    subheader: {
                        fontSize: 15,
                        bold: true,
                        margin: [0, 0, 0, 5]
                    },
                    itemsTable: {
                        margin: [0, 5, 0, 10]
                    },
                    itemsTableHeader: {
                        bold: true,
                        fontSize: 15,
                        color: 'black'
                    },
                    totalsTable: {
                        bold: true,
                        margin: [0, 10, 0, 0]
                    },
                    finalTotalTable:{
                      bold: true,
                      fontSize:15,
                        margin: [0, 20, 0, 0] 
                    },
                    personalDetails:{
                      bold: true,
                      fontSize:10,
                      margin: [0, 0, 0, 5]
                    }
                }
    };

    //Creating PDF in Base64
    pdfMake.createPdf(documentDefination).getBase64(function(base64){
        pdf = atob(base64);       
        var arr = new Array(pdf.length);
        for(var i = 0; i < pdf.length; i++) {
          arr[i] = pdf.charCodeAt(i);
      }
      var byteArray = new Uint8Array(arr);      
      var blob = new Blob([byteArray], {type: 'application/pdf'});
      $scope.pdfUrl = URL.createObjectURL(blob);
                
      //writing file on device        
      var folderpath = cordova.file.externalRootDirectory;
      var filename = $scope.fileName+".pdf";

      window.resolveLocalFileSystemURL(folderpath, function(dir) {
          console.log("Access to the directory granted succesfully");
          dir.getFile(filename, {create:true}, function(file) {
                  console.log("File created succesfully.");
                  file.createWriter(function(fileWriter) {
                      console.log("Writing content to file");
                      fileWriter.write(blob);
                  }, function(){
                      alert('Unable to save file in path '+ folderpath);
                  });
          });
      });

      //Opening created pdf file into default file opener (Acrobat for PDF)
      $cordovaFileOpener2.open(folderpath+filename,'application/pdf')
        .then(function() {
          console.log('Success');
        }, function(err) {
        console.log('An error occurred: ' + JSON.stringify(err));
      });

    });
  }
})
